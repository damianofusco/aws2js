var assert = require('assert');
var s3 = require('../').load('s3');
var path = 'foo.png';

var callbacks = {
	put: false,
	head: false,
	del: false
};

s3.setCredentials(process.env.AWS_ACCEESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);
s3.setBucket(process.env.AWS2JS_S3_BUCKET);

s3.putFile(path, './data/foo.png', false, {}, function (err, res) {
	callbacks.put = true;
	assert.ifError(err);
	s3.head(path, function (err, res) {
		callbacks.head = true;
		assert.ifError(err);
		assert.deepEqual(res['content-type'], 'image/png');
		s3.del(path, function (err) {
			callbacks.del = true;
			assert.ifError(err);
		});
	});
});

process.on('exit', function () {
	for (var i in callbacks) {
		assert.ok(callbacks[i]);
	}
});
