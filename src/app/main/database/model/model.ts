// // import path from "path";
// // import db from "../";

// // const TablePrefix = "xph_";

// class Model {
//   // static New (obj: { [key: string]: number }) {
//   // let keys = Object.keys(obj);
//   // console.log(keys);
//   // const tmp = <typeof obj>this;
//   // keys.forEach((value: string) => {
//   //   console.log(value, tmp);
//   //   if (tmp.hasOwnProperty(value)) {
//   //     tmp[value] = obj[value];
//   //   }
//   // });
//   // }
//   // id!: number;
//   // save() {
//   //   if (!!this.id) {
//   //     db.run(
//   //       `insert into ${TablePrefix +
//   //         path.basename(__filename, ".ts")} values (?)`,
//   //       Object.values(this)
//   //     );
//   //   }
//   // }
//   // get(flag: { [key: string]: string }) {
//   //   console.log(flag);
//   //   let key = Object.keys(flag);
//   //   let value = Object.values(flag);
//   //   let condition = "";
//   //   key.forEach(value => {
//   //     condition += value + "= $" + value;
//   //   });
//   //   db.get(
//   //     `select * from ${TablePrefix +
//   //       path.basename(__filename, ".ts")} where ${condition}`,
//   //     value,
//   //     (err: Error, row: any) => {
//   //       console.log(err, row);
//   //     }
//   //   );
//   // }
// }

// export default Model;
