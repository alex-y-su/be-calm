/**
 * Notification System
 * Manages notifications across multiple channels
 */

import { EventEmitter } from 'node:events';
import chalk from 'chalk';

class NotificationSystem extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = config;
    this.channels = new Map();
    this.preferences = config.levels || {};
    this.quietHours = config.quiet_hours || { enabled: false };
  }

  /**
   * Initialize notification system
   */
  async initialize() {
    // Initialize channels
    if (this.config.channels?.cli?.enabled !== false) {
      this.registerChannel('cli', new CLIChannel());
    }

    if (this.config.channels?.web?.enabled) {
      this.registerChannel('web', new WebChannel(this.config.channels.web));
    }

    if (this.config.channels?.email?.enabled) {
      this.registerChannel('email', new EmailChannel(this.config.channels.email));
    }

    if (this.config.channels?.slack?.enabled) {
      this.registerChannel('slack', new SlackChannel(this.config.channels.slack));
    }

    this.emit('initialized');
  }

  /**
   * Register a notification channel
   */
  registerChannel(name, channel) {
    this.channels.set(name, channel);
    this.emit('channel-registered', { name });
  }

  /**
   * Send a notification
   * @param {string} level - Notification level (info, warning, error, critical)
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {Object} options - Additional options
   */
  async notify(level, title, message, options = {}) {
    // Check quiet hours
    if (this.isQuietHours() && level !== 'critical') {
      return;
    }

    // Get channels for this level
    const levelConfig = this.preferences[level];
    if (!levelConfig?.enabled) {
      return;
    }

    const channelNames = levelConfig.channels || ['cli'];

    // Send to each channel
    const promises = [];
    for (const channelName of channelNames) {
      const channel = this.channels.get(channelName);
      if (channel) {
        promises.push(channel.send(level, title, message, options));
      }
    }

    await Promise.all(promises);

    this.emit('notification-sent', { level, title, channelNames });
  }

  /**
   * Send info notification
   */
  async info(title, message, options = {}) {
    await this.notify('info', title, message, options);
  }

  /**
   * Send warning notification
   */
  async warning(title, message, options = {}) {
    await this.notify('warning', title, message, options);
  }

  /**
   * Send error notification
   */
  async error(title, message, options = {}) {
    await this.notify('error', title, message, options);
  }

  /**
   * Send critical notification
   */
  async critical(title, message, options = {}) {
    await this.notify('critical', title, message, options);
  }

  /**
   * Check if current time is in quiet hours
   */
  isQuietHours() {
    if (!this.quietHours.enabled) {
      return false;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [startHour, startMin] = this.quietHours.start_time.split(':').map(Number);
    const [endHour, endMin] = this.quietHours.end_time.split(':').map(Number);

    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Quiet hours span midnight
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  /**
   * Update notification preferences
   */
  updatePreferences(level, channels) {
    if (!this.preferences[level]) {
      this.preferences[level] = { enabled: true, channels: [] };
    }

    this.preferences[level].channels = channels;
    this.emit('preferences-updated', { level, channels });
  }

  /**
   * Disable notifications for a level
   */
  disableLevel(level) {
    if (this.preferences[level]) {
      this.preferences[level].enabled = false;
    }
    this.emit('level-disabled', { level });
  }

  /**
   * Enable notifications for a level
   */
  enableLevel(level) {
    if (!this.preferences[level]) {
      this.preferences[level] = { enabled: true, channels: ['cli'] };
    } else {
      this.preferences[level].enabled = true;
    }
    this.emit('level-enabled', { level });
  }
}

/**
 * CLI Channel
 */
class CLIChannel {
  async send(level, title, message, options = {}) {
    const icons = {
      info: 'ℹ',
      warning: '⚠',
      error: '✗',
      critical: '🛑'
    };

    const colors = {
      info: chalk.blue,
      warning: chalk.yellow,
      error: chalk.red,
      critical: chalk.bgRed.white
    };

    const icon = icons[level] || 'ℹ';
    const color = colors[level] || chalk.blue;

    console.log(color(`${icon} ${title}`));
    if (message) {
      console.log(color(`  ${message}`));
    }
  }
}

/**
 * Web Channel (WebSocket/SSE)
 */
class WebChannel {
  constructor(config) {
    this.config = config;
    this.connections = new Set();
  }

  async send(level, title, message, options = {}) {
    const notification = {
      level,
      title,
      message,
      timestamp: Date.now(),
      ...options
    };

    // Broadcast to all connected clients
    for (const connection of this.connections) {
      try {
        connection.send(JSON.stringify(notification));
      } catch (error) {
        // Remove dead connection
        this.connections.delete(connection);
      }
    }
  }

  addConnection(connection) {
    this.connections.add(connection);
  }

  removeConnection(connection) {
    this.connections.delete(connection);
  }
}

/**
 * Email Channel
 */
class EmailChannel {
  constructor(config) {
    this.config = config;
    // In production, would initialize email transport (nodemailer, etc.)
  }

  async send(level, title, message, options = {}) {
    // Placeholder for email sending
    console.log(chalk.gray(`[Email] Would send: ${level} - ${title}`));

    // In production:
    // await this.transport.sendMail({
    //   from: this.config.from_address,
    //   to: options.recipients || this.config.default_recipients,
    //   subject: `[BMAD ${level.toUpperCase()}] ${title}`,
    //   text: message
    // });
  }
}

/**
 * Slack Channel
 */
class SlackChannel {
  constructor(config) {
    this.config = config;
    this.webhookUrl = config.webhook_url;
  }

  async send(level, title, message, options = {}) {
    if (!this.webhookUrl) {
      return;
    }

    const colors = {
      info: '#36a64f',
      warning: '#ff9900',
      error: '#ff0000',
      critical: '#990000'
    };

    const payload = {
      channel: this.config.channel || '#bmad-notifications',
      attachments: [{
        color: colors[level],
        title,
        text: message,
        footer: 'BMAD Notification',
        ts: Math.floor(Date.now() / 1000)
      }]
    };

    // Placeholder for Slack webhook
    console.log(chalk.gray(`[Slack] Would send: ${level} - ${title}`));

    // In production:
    // await fetch(this.webhookUrl, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // });
  }
}

// Singleton instance
let instance = null;

export default {
  NotificationSystem,
  getInstance: (config) => {
    if (!instance) {
      instance = new NotificationSystem(config);
    }
    return instance;
  }
};
