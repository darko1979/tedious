var tedious = require("../../lib/tedious");
var Request = tedious.Request;
var TYPES = tedious.TYPES;

var common = require("../common");

common.createBenchmark({
  name: "inserting varbinary(max) with 5 MiB",

  profileIterations: 100,

  setup: function(connection, cb) {
    var request = new Request("CREATE TABLE #benchmark ([value] varbinary(max))", function(err) {
      if (err) return cb(err);

      var request = new Request("INSERT INTO #benchmark ([value]) VALUES (@value)", cb);
      var buf = new Buffer(5 * 1024 * 1024);
      buf.fill("x");
      request.addParameter("value", TYPES.VarBinary, buf);
      connection.execSql(request);
    });

    connection.execSqlBatch(request);
  },

  exec: function(connection, cb) {
    var request = new Request("SELECT * FROM #benchmark", cb);
    connection.execSql(request);
  },

  teardown: function(connection, cb) {
    var request = new Request("DROP TABLE #benchmark", cb);
    connection.execSqlBatch(request);
  }
});
