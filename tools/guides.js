// Prints {guideId: [urgentId, ...]} so /api/e only counts guides and warnings that really exist.
global.window = global;
['kb','cites','j-money','j-family','j-consumer','j-other','j-nri','j-business','j-more','j-genz','j-gaps','j-rights','j-crucial','stand','law-2026','situations','reviews','qa','qa2'].forEach((f) => require('../src/' + f + '.js'));
const o = {}; for (const i of global.ER_KB.issues) o[i.id] = (i.urgent || []).map((u) => u.id);
process.stdout.write(JSON.stringify(o));
