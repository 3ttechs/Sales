import sqlite3
from flask import Flask, request,json
from  db_utilities import *

app = Flask(__name__)

#http://localhost:5000/product/all
@app.route('/product/all', methods=['GET'])
def product_all():
    query = 'select category, name from product'
    json_output = json.dumps(run_query(query))
    return json_output, 200


#http://localhost:5000/product/name='abc'
@app.route('/product/name=<name>', methods=['GET'])
def product_by_name(name):
    query = 'select * from product where name = '+ name
    json_output = json.dumps(run_query(query,[name]))
    return json_output, 200

#http://localhost:5000/invoice/id=1
@app.route('/invoice/id=<id>', methods=['GET'])
def invoice_by_id(id):
    query = 'select * from invoice where id = '+ id
    json_output = json.dumps(run_query(query))
    query = 'select * from items where invoice_id = '+ id
    json_output+= json.dumps(run_query(query))
    return json_output, 200

'''
select invoice.id,invoice.date,invoice.time,invoice.sales_person,invoice.cutomer_phone,items.product_category,items.product_name,items.product_price,items.quantity,items.amount,items.tax,invoice.total_amount,invoice.total_tax,invoice.payment_type from invoice,items where invoice.date >= '2010-05-15' and invoice.date <= '2018-05-15' 

'''
#http://localhost:5000/report/type=Date,from='2015-05-15',to='2018-05-15'
@app.route('/report/type=<report_type>,from=<from_date>,to=<to_date>', methods=['GET'])
def report(report_type,from_date,to_date):
    if(str(report_type) == 'date'):

        query = 'select invoice.date,' \
                'round(sum(invoice.total_amount),2) as total_amount,' \
                'round(sum(invoice.total_tax),2) as total_tax ' \
                'from invoice,items ' \
                'where invoice.date >= '+  from_date + ' and invoice.date <= '+  to_date + ' group by invoice.date'

    elif(report_type=='sales_person'):
        query = 'select invoice.sales_person, invoice.date,' \
                'round(sum(invoice.total_amount),2) as total_amount,' \
                'round(sum(invoice.total_tax),2) as total_tax ' \
                'from invoice,items ' \
                'where invoice.date >= '+  from_date + ' and invoice.date <= '+  to_date + ' group by invoice.sales_person'

    elif(report_type=='payment_type'):
        query = 'select invoice.payment_type, invoice.date,' \
                'round(sum(invoice.total_amount),2) as total_amount,' \
                'round(sum(invoice.total_tax),2) as total_tax ' \
                'from invoice,items ' \
                'where invoice.date >= '+  from_date + ' and invoice.date <= '+  to_date + ' group by invoice.payment_type'

    elif (report_type == 'category'):
        query = 'select items.product_category as category, invoice.date, ' \
                'round(sum(invoice.total_amount),2) as total_amount,' \
                'round(sum(invoice.total_tax),2) as total_tax from invoice,items ' \
                'where invoice.date >= ' + from_date + ' and invoice.date <= ' + to_date + \
                ' and items.invoice_id=invoice.id group by items.product_category'

    json_output = json.dumps(run_query(query))
    return json_output, 200

@app.route('/sales_person/login', methods=['POST'])
# body : {"login": "Abdul","password":"abdul"}
def sales_person_login():
    data = json.loads(request.data)
    query = 'select count(*) as count from sales_person where name = "'+ data['login'] +'" and password = "' +data['password']+'"'
    result = run_query(query);
    count = result[0]['count']
    return str(count), 200

@app.route('/admin/login', methods=['POST'])
# body : {"login": "Admin","password":"admin"}
def admin_login():
    data = json.loads(request.data)
    query = 'select count(*) as count from admin where name = "'+ data['login'] +'" and password = "' +data['password']+'"'
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




