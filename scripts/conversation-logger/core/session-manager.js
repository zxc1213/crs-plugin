/**
 * 会话管理器
 * 管理活跃会话的状态和事件
 */
export class SessionManager {
  constructor() {
    this.sessions = new Map();
  }

  /**
   * 创建新会话
   * @param {string} sessionId - 会话 ID
   * @param {object} metadata - 元数据
   */
  createSession(sessionId, metadata = {}) {
    this.sessions.set(sessionId, {
      id: sessionId,
      status: 'active',
      startTime: new Date().toISOString(),
      metadata,
      events: [],
    });
  }

  /**
   * 检查会话是否存在
   * @param {string} sessionId - 会话 ID
   * @returns {boolean}
   */
  hasSession(sessionId) {
    return this.sessions.has(sessionId);
  }

  /**
   * 获取会话
   * @param {string} sessionId - 会话 ID
   * @returns {object} 会话对象
   */
  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }

  /**
   * 添加事件
   * @param {string} sessionId - 会话 ID
   * @param {object} event - 事件对象
   */
  addEvent(sessionId, event) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    session.events.push({
      ...event,
      timestamp: event.timestamp || new Date().toISOString(),
    });
  }

  /**
   * 标记为重要
   * @param {string} sessionId - 会话 ID
   * @param {string} reason - 原因
   */
  markImportant(sessionId, reason) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    session.metadata.important = true;
    session.metadata.reason = reason;
  }

  /**
   * 结束会话
   * @param {string} sessionId - 会话 ID
   * @returns {object} 会话摘要
   */
  endSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    session.status = 'completed';
    session.endTime = new Date().toISOString();

    return {
      sessionId,
      status: session.status,
      startTime: session.startTime,
      endTime: session.endTime,
      messageCount: session.events.filter(
        (e) => e.type === 'user_message' || e.type === 'ai_response'
      ).length,
      toolCallCount: session.events.filter((e) => e.type === 'tool_use').length,
    };
  }
}
