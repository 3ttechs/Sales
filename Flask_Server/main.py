import sqlite3
from flask import Flask, request,json
from  db_utilities import *

app = Flask(__name__)

#http://localhost:5000/product/all
@app.route('/product/all', methods=['GET'])
def product_all():
    query = 'select code, name from product_master'
    json_output = json.dumps(run_query(query))
    return json_output, 200


#http://localhost:5000/product/name='abc'
@app.route('/product/name=<name>', methods=['GET'])
def product_by_name(name):
    query = 'select * from product_master where name = '+ name
    json_output = json.dumps(run_query(query,[name]))
    return json_output, 200

#http://localhost:5000/invoice/invoice_no=1
@app.route('/invoice/invoice_no=<id>', methods=['GET'])
def invoice_by_id(invoice_no):
    query = 'select * from invoice where invoice_no = '+ invoice_no
    json_output = json.dumps(run_query(query))
    query = 'select * from items where   = '+ invoice_no
    json_output+= json.dumps(run_query(query))
    return json_output, 200

#http://localhost:5000/invoice/add
@app.route('/invoice/add', methods=['POST'])
def invoice_add():
    data = json.loads(request.data)
    query = 'select count(*) as count from sales_person_master where login = "'+ data['login'] +'" and password = "' +data['password']+'"'
    result = run_query(query);
    count = result[0]['count']
    return str(count), 200


'''
select invoice.id,invoice.date,invoice.time,invoice.sales_person,invoice.cutomer_phone,items.product_category,items.product_name,items.product_price,items.quantity,items.amount,items.tax,invoice.total_amount,invoice.total_tax,invoice.payment_type from invoice,items where invoice.date >= '2010-05-15' and invoice.date <= '2018-05-15' 

'''
#http://localhost:5000/report/type=Date,from='2015-05-15',to='2018-05-15'
@app.route('/report/type=<report_type>,from=<from_date>,to=<to_date>', methods=['GET'])
def report(report_type,from_date,to_date):
    if(str(report_type) == 'date'):

        query = 'select invoice.invoice_date ,' \
                'round(sum(invoice.sub_total),2) as sub_total,' \
                'round(sum(invoice.discount),2) as discount ' \
                'round(sum(invoice.vat),2) as vat,' \
                'round(sum(invoice.total),2) as total ' \
                'from invoice,items ' \
                'where invoice.invoice_date  >= '+  from_date + ' and invoice.invoice_date  <= '+  to_date + ' group by invoice.invoice_date '

    elif(report_type=='sales_person'):
        query = 'select invoice.sales_person, invoice.invoice_date ,' \
                'round(sum(invoice.sub_total),2) as sub_total,' \
                'round(sum(invoice.discount),2) as discount ' \
                'round(sum(invoice.vat),2) as vat,' \
                'round(sum(invoice.total),2) as total ' \
                'from invoice,items ' \
                'where invoice.invoice_date  >= '+  from_date + ' and invoice.invoice_date  <= '+  to_date + ' group by invoice.sales_person'

    elif(report_type=='payment_mode'):
        query = 'select invoice.payment_mode, invoice.invoice_date ,' \
                'round(sum(invoice.sub_total),2) as sub_total,' \
                'round(sum(invoice.discount),2) as discount ' \
                'round(sum(invoice.vat),2) as vat,' \
                'round(sum(invoice.total),2) as total ' \
                'from invoice,items ' \
                'where invoice.invoice_date  >= '+  from_date + ' and invoice.invoice_date  <= '+  to_date + ' group by invoice.payment_mode'

    elif (report_type == 'category'):
        query = 'select items.product_category as category, invoice.invoice_date , ' \
                'round(sum(invoice.sub_total),2) as sub_total,' \
                'round(sum(invoice.discount),2) as discount ' \
                'round(sum(invoice.vat),2) as vat,' \
                'round(sum(invoice.total),2) as total ' \
                'where invoice.invoice_date  >= ' + from_date + ' and invoice.invoice_date  <= ' + to_date + \
                ' and items.invoice_no=invoice.invoice_no group by items.product_category'
    print(query)
    json_output = json.dumps(run_query(query))
    return json_output, 200

@app.route('/sales_person/login', methods=['POST'])
# body : {"login": "Abdul","password":"abdul"}
def sales_person_login():
    data = json.loads(request.data)
    query = 'select count(*) as count from sales_person_master where login = "'+ data['login'] +'" and password = "' +data['password']+'"'
    result = run_query(query);
    count = result[0]['count']
    return str(count), 200

@app.route('/admin/login', methods=['POST'])
# body : {"login": "Admin","password":"admin"}
def admin_login():
    data = json.loads(request.data)
    query = 'select count(*) as count from admin_lookup where login = "'+ data['login'] +'" and password = "' +data['password']+'"'
    result = run_query(query);
    count = result[0]['count']
    return str(count), 200



@app.route('/')
def home():
    return('Smart Shopper Application')

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin','*')
    #response.headers.add('Access-Control-Allow-Headers','Origin,Accept,X-Requested-With','Content-Type')
    response.headers.add('Access-Control-Allow-Methods','GET,PUT,POST,DELETE')
    return response

if __name__ == '__main__':
    app.run(host='localhost', port='5000')




