const { query } = require('express');
const { getConnection } = require('../../utils/db');

const getDataTransaksi = async (req, res) => {
    
    const connection = getConnection();

    const params = req.query;
    const { itemId, divisionId, tanggalTransaksiFrom, tanggalTransaksiTo, tipeTransaksi } = params;

    const queryParams = [];

    let selectQuery = "SELECT trx.id, "
        + " item.part_number, item.part_name, "
        + " divs.division_code, divs.division_name, " 
        + " trx.doc_no, date(trx.tanggal_transaksi) as tanggal_transaksi, " 
        + " trx.tipe_transaksi, trx.qty as jumlah_transaksi, "
        + " trx.qty_sebelum, trx.qty_sesudah, trx.is_fix as sudah_fix "
        + " FROM barang_transaksi trx "
        + " INNER JOIN ITEMS item on trx.item_id = item.id "
        + " INNER JOIN DIVISIONS divs on trx.division_id = divs.id ";
    let conditionQuery = " WHERE ";
    let conditionQueryParams = "";
    
    if (itemId !== null && itemId !== undefined && itemId !== '') {
        conditionQueryParams += ' trx.item_id = ? ';
        queryParams.push(itemId);
    }

    if (divisionId !== null && divisionId !== undefined && divisionId !== '') {
        if (conditionQueryParams !== '') {
            conditionQueryParams += ' and '
        } 
        conditionQueryParams += ' trx.division_id = ? ';
        queryParams.push(divisionId);
    }

    if (tanggalTransaksiFrom !== null && tanggalTransaksiFrom !== undefined && tanggalTransaksiFrom !== '') {
        if (conditionQueryParams !== '') {
            conditionQueryParams += ' and '
        } 
        conditionQueryParams += ' trx.tanggal_transaksi >= ? ';
        queryParams.push(tanggalTransaksiFrom);
    }

    if (tanggalTransaksiTo !== null && tanggalTransaksiTo !== undefined && tanggalTransaksiTo !== '') {
        if (conditionQueryParams !== '') {
            conditionQueryParams += ' and '
        } 
        conditionQueryParams += ' trx.tanggal_transaksi <= ? ';
        queryParams.push(tanggalTransaksiTo);
    }

    if (tipeTransaksi !== null && tipeTransaksi !== undefined &&  tipeTransaksi !== '') {
        if (conditionQueryParams !== '') {
            conditionQueryParams += ' and '
        } 
        conditionQueryParams += ' trx.tipe_transaksi = ? ';
        queryParams.push(tipeTransaksi);
    }

    const orderSt = " ORDER BY trx.item_id, trx.tanggal_transaksi ASC ";

    const fullQuerySt = selectQuery + 
        (conditionQueryParams !== '' ? (conditionQuery + conditionQueryParams) : '') +
        orderSt;

    const [datas] = await connection.query(fullQuerySt, queryParams);

    datas.map(data => {
        const dateTransaksi = new Date(data.tanggal_transaksi);

        const year = dateTransaksi.getFullYear();
        const month = String(dateTransaksi.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(dateTransaksi.getDate()).padStart(2, '0');

        data.tanggal_transaksi = `${year}-${month}-${day}`;

        return data;
    });

    return res.status(200).json(datas);
};

const createInputItem = async (req, res) => {
    const {
        divisionId,
        itemId,
        docNo,
        tanggalTransaksi,
        qty
    } = req.body;

    try {
        const connection = getConnection();

        const selectQuery = "SELECT * FROM items where id = ? ";
        const [items] = await connection.query(selectQuery, [itemId]);

        if (items.length === 0) {
            return res.status(404).json({
                message: 'Item does not exist'
            });
        }

        const item = items[0];

        let qtyInput = qty;

        const selectQuery2 = "SELECT * FROM divisions where id = ? ";
        const [divisions] = await connection.query(selectQuery2, [divisionId]);

        if (divisions.length === 0) {
            return res.status(404).json({
                message: 'Division does not exist'
            });
        }

        const insertQuery = "INSERT INTO barang_transaksi (division_id, item_id, doc_no, tanggal_transaksi, tipe_transaksi, qty, is_fix) "
            + " VALUES (?, ?, ?, ?, ?, ?, ?) ";
        await connection.query(insertQuery, [divisionId, itemId, docNo, tanggalTransaksi, 'MASUK', qtyInput, 'NO']);

        return res.status(201).json({
            message: 'Item Input Transaction Succesfully Saved.'
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            message: 'System Error Failed to Save Data'
        });
    }
};

const createOutputItem = async(req, res) => {

    const {
        divisionId,
        itemId,
        docNo,
        tanggalTransaksi,
        qty
    } = req.body;

    try {
        const connection = getConnection();

        const selectQuery = "SELECT * FROM items where id = ? ";
        const [items] = await connection.query(selectQuery, [itemId]);

        if (items.length === 0) {
            return res.status(404).json({
                message: 'Item does not exist'
            });
        }

        let qtyInput = qty;

        const selectQuery2 = "SELECT * FROM divisions where id = ? ";
        const [divisions] = await connection.query(selectQuery2, [divisionId]);

        if (divisions.length === 0) {
            return res.status(404).json({
                message: 'Division does not exist'
            });
        }

        const insertQuery = "INSERT INTO barang_transaksi (division_id, item_id, doc_no, tanggal_transaksi, tipe_transaksi, qty, is_fix) "
            + " VALUES (?, ?, ?, ?, ?, ?, ?) ";
        await connection.query(insertQuery, [divisionId, itemId, docNo, tanggalTransaksi, 'KELUAR', qtyInput, 'NO']);

        return res.status(201).json({
            message: 'Item Output Transaction Succesfully Saved.'
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            message: 'System Error Failed to Save Data'
        });
    }
};

const deleteTransaksi = async (req, res) => {
    const connection = getConnection();

    const {id} = req.params;

    try {

        const deleteQuery = "delete from barang_transaksi where id = ? and is_fix = 'NO' ";
        await connection.query(deleteQuery, [id, 'NO']);

        return res.status(200).json({
            message: 'Data Transaksi Succesfully Deleted.'
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            message: 'System Error Failed to Save Data'
        });
    }
};

const updateTransaksi = async (req, res) => {

    const {id} = req.params;

    const {
        divisionId,
        itemId,
        docNo,
        tanggalTransaksi,
        qty
    } = req.body;

    try {

        const connection = getConnection();

        const selectQuery3 = "SELECT * FROM barang_transaksi where id = ? ";
        const [trxs] = await connection.query(selectQuery3, [id]);

        if (trxs.length === 0) {
            return res.status(404).json({
                message: 'Transaksi does not exist'
            });
        }

        const trx = trxs[0];

        const selectQuery = "SELECT * FROM items where id = ? ";
        const [items] = await connection.query(selectQuery, [itemId]);

        if (items.length === 0) {
            return res.status(404).json({
                message: 'Item does not exist'
            });
        }

        const item = items[0];

        const selectQuery2 = "SELECT * FROM divisions where id = ? ";
        const [divisions] = await connection.query(selectQuery2, [divisionId]);

        if (divisions.length === 0) {
            return res.status(404).json({
                message: 'Division does not exist'
            });
        }
        
        let qtyInput = qty;
        let qtySebelum = 0;
        let qtySesudah = 0;

        if (trx.tipe_transaksi === 'MASUK') {
            qtySebelum = item.qty;
            qtySesudah = item.qty + qtyInput;
        } else {
            qtySebelum = item.qty;
            qtySesudah = item.qty + qtyInput;
        }

        const updateQuery = "UPDATE barang_transaksi set division_id = ?, item_id = ?, doc_no = ?, tanggal_transaksi = ?, qty = ?, qty_sebelum = ?, qty_sesudah = ?, is_fix = ? where id = ? ";
        await connection.query(updateQuery, [divisionId, itemId, docNo, tanggalTransaksi, qtyInput, qtySebelum, qtySesudah, 'YES', id]);

        const updateQuery2 = "UPDATE items set qty = ? where id = ? ";
        await connection.query(updateQuery2, [qtySesudah, itemId]);

        return res.status(201).json({
            message: 'Item Output Transaction Succesfully Saved.'
        });

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            message: 'System Error Failed to Update Data'
        });
    }
};

module.exports = {
    getDataTransaksi,
    createInputItem,
    createOutputItem,
    deleteTransaksi,
    updateTransaksi
};