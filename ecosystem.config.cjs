module.exports = {
  apps : [{
    name   : "NitroFree",
    script : "index.js",
    instances: "2",
    exec_mode: "cluster",
    merge_logs: true,
  }]
}