import * as server from './service'
import * as db from './database'
import reals from './database/model/reals'

export function start () {
  server.init()
  // console.log(process.versions.electron);
  // console.log(db);

  // console.log(relay);
  // relay.get({ abc: "1" });
  // let ele = {};
  // db.get(db.tables.element, { id: 4 })
  //   .then(data => {
  //     console.log(data);
  //     ele = data;
  //     // db.insert(db.tables.element, ele);
  //   })
  //   .catch(console.log);

  // db.all(db.tables.relay)
  //   .then(console.log)
  //   .catch(console.log);

  // db.all(db.tables.relay, { id: 1 })
  //   .then(console.log)
  //   .catch(console.log);

  // db.all(db.tables.relay, { id: 1, indexs: 3 }, "or")
  //   .then(console.log)
  //   .catch((err: Error) => {
  //     console.log(err, "所有查询错误");
  //   });

  // db.update(
  //   db.tables.element,
  //   { name: "sb", unit: "m/s" },
  //   { id: 123, "or id": 124 },
  //   ""
  // );

  // db.del(db.tables.element, { id: 123, "or id": 124 }, "");

  // let real: reals = {
  //   id: 0,
  //   fac_id: 0,
  //   data_time: 0,
  //   e1: 0,
  //   e2: 0,
  //   e3: 0,
  //   e4: 0,
  //   e5: 0,
  //   e6: 0,
  //   e7: 0,
  //   e8: 0,
  //   e9: 0,
  //   e10: 0,
  //   e11: 0,
  //   e12: 0,
  //   e13: 0,
  //   e14: 0,
  //   e15: 0,
  //   e16: 0,
  //   JK1: 0,
  //   JK2: 0,
  //   JK3: 0,
  //   JK4: 0,
  //   JK5: 0,
  //   JK6: 0,
  //   JK7: 0,
  //   JK8: 0,
  //   JK9: 0,
  //   JK10: 0,
  //   JK11: 0,
  //   JK12: 0,
  //   JK13: 0,
  //   JK14: 0,
  //   JK15: 0,
  //   JK16: 0,
  //   JK17: 0,
  //   JK18: 0,
  //   JK19: 0,
  //   JK20: 0,
  //   JK21: 0,
  //   JK22: 0,
  //   JK23: 0,
  //   JK24: 0,
  //   JK25: 0,
  //   JK26: 0,
  //   JK27: 0,
  //   JK28: 0,
  //   JK29: 0,
  //   JK30: 0,
  //   JK31: 0,
  //   JK32: 0
  // };
  // for (let i = 0; i < 100; i++)
  //   db.insert(db.tables.reals, real)
  //     .then(console.log)
  //     .catch(console.log);
  // // db.del(db.tables.reals)
  // //   .then(console.log)
  // //   .catch(console.log);
  // db.get(db.tables.reals, { fac_id: 0 })
  //   .then(data => {
  //     console.log(data);
  //     ele = data;
  //     // db.insert(db.tables.element, ele);
  //   })
  //   .catch(console.log);
}
