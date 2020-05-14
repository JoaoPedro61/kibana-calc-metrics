export default function(server) {
  server.route({
    path: '/api/kbn-calc-metrics/example',
    method: 'GET',
    handler() {
      return { time: new Date().toISOString() };
    },
  });
}
