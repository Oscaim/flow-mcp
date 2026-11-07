let queued = 0;
process.on('message', async ({id, method, args}) => {
  if (method === 'hold') await new Promise(r => setTimeout(r, 500));
  if (method === 'setQueued') queued = args;
  const result = method === '__restart_check' ? {active: queued, completed: 0} : {ok: true};
  process.send({id, result});
});
process.on('disconnect', () => process.exit(0));
process.send({ready:true});
