Studio = require('../../compiled/core/studio');

describe("A message", function() {
  var SENDER_ID = 'sender_message',
    RECEIVER_ID = 'receiver_message';
  var sender = new Studio.Actor({
    id: SENDER_ID,
    process: function(message, headers) {}
  });
  new Studio.Actor({
    id: RECEIVER_ID,
    process: function(message, headers) {
      message.hello = 'copy';
      message.inner.content = 'new';
      delete message.toDelete;
      return message;
    }
  });
  it("should be copied", function(done) {
    var message = {
      hello: 'hello',
      inner: {
        content: 'content'
      },
      toDelete: 'delete'
    };
    sender.send(RECEIVER_ID, message).then(function(result) {
      expect(result.hello).toBeDefined();
      expect(result.hello).not.toBe(message.hello);
      expect(result.inner).toBeDefined();
      expect(result.inner.content).not.toBe(message.inner.content);
      expect(result.toDelete).toBeUndefined();
      expect(message.toDelete).toBeDefined();
      done();
    });
  });
});