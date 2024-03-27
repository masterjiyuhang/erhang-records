const table = `| 1             | 10248   | 11        | 12       |
| 2             | 10248   | 42        | 10       |
| 3             | 10248   | 72        | 5        |
| 4             | 10249   | 14        | 9        |
| 5             | 10249   | 51        | 40       |
| 6             | 10250   | 41        | 10       |
| 7             | 10250   | 51        | 35       |
| 8             | 10250   | 65        | 15       |`;

const tableData = [];
table.split('\n').forEach((item) => {
  const r = item
    .split('|')
    .map((subItem) => subItem.trim())
    .filter((thirdItem) => thirdItem !== '');

  const OrderDetailID = parseInt(r[0]);
  const OrderID = parseInt(r[1]);
  const ProductID = parseInt(r[2]);
  const Quantity = parseInt(r[3]);
  tableData.push(`(${OrderDetailID}, ${OrderID}, ${ProductID}, ${Quantity})`);
});

let resSQL = `INSERT INTO OrderDetails ( OrderDetailID, OrderID, ProductID, Quantity )
VALUES`;

tableData.forEach(
  (item, index) =>
    (resSQL += `${item}${index === tableData.length - 1 ? ';' : ','}`)
);

console.log(resSQL);
