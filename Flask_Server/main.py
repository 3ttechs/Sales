import sqlite3
from flask import Flask, request,json,send_from_directory,Response
import logging, os

from  db_utilities import *

app = Flask(__name__)

#http://localhost:5000/product/all
@app.route('/product/all', methods=['GET'])
def product_all():
    query = 'select code, name from product_master'
    json_output = json.dumps(run_query(query))
    return json_output, 200

#http://localhost:5000/product_category/all
@app.route('/product_category/all', methods=['GET'])
def product_category_all():
    query = 'select category_id, category_name from product_category_lookup'
    json_output = json.dumps(run_query(query))
    return json_output, 200

#http://localhost:5000/product_brand/all
@app.route('/product_brand/all', methods=['GET'])
def product_brand_all():
    query = 'select brand_id, brand_name from product_brand_lookup'
    json_output = json.dumps(run_query(query))
    return json_output, 200

#http://localhost:5000/product_type/all
@app.route('/product_type/all', methods=['GET'])
def product_type_all():
    query = 'select type_id, type_name from product_type_lookup'
    json_output = json.dumps(run_query(query))
    return json_output, 200

#http://localhost:5000/product_coo/all
@app.route('/product_coo/all', methods=['GET'])
def product_coo_all():
    query = 'select coo_id, coo_name from product_coo_lookup'
    json_output = json.dumps(run_query(query))
    return json_output, 200

#http://localhost:5000/company/company_id='AB1234'
@app.route('/company/company_id=<company_id>', methods=['GET'])
def company_by_id(company_id):
    query = 'select * from company_lookup where company_id = '+ company_id
    json_output = json.dumps(run_query(query))
    return json_output, 200


#http://localhost:5000/product/name='Romance'
@app.route('/product/name=<name>', methods=['GET'])
def product_by_name(name):
    query = 'select * from product_master where name = '+ name
    json_output = json.dumps(run_query(query,[name]))
    return json_output, 200

#http://localhost:5000/invoice_header/invoice_no=1
@app.route('/invoice_header/invoice_no=<invoice_no>', methods=['GET'])
def invoice_header_by_id(invoice_no):
    query = 'select * from invoice where id = '+ invoice_no
    json_output = json.dumps(run_query(query))
    return json_output, 200

#http://localhost:5000/invoice_items/invoice_no=1
@app.route('/invoice_items/invoice_no=<invoice_no>', methods=['GET'])
def invoice_items_by_id(invoice_no):
    query = 'select * from items where invoice_no  = '+ invoice_no
    json_output = json.dumps(run_query(query))
    return json_output, 200

''' ------------------------------------BODY JSON-------------------------------------------------------------
{
  "invoice": {
    "sales_person_code": "Abdul",
    "cutomer_name": "AA",
    "cutomer_phone": 9448373533,
    "cutomer_vat_no": "11",
    "sub_total": 36.54,
    "discount": 0.01,
    "vat": 0.01,
    "total": 11.02,
    "payment_mode": 1
  },
  "items": [
    {
      "id": 1,
      "product_code": "1",
      "product_category": "Floral",
      "product_name": "Diasy",
      "product_price": 2.54,
      "product_coo": "India",
      "quantity": 12,
      "discount": 0.02,
      "amount": 25
    },
    {
      "id": 2,
      "product_code": "1",
      "product_category": "Floral",
      "product_name": "Diasy",
      "product_price": 2.54,
      "product_coo": "India",
      "quantity": 12,
      "discount": 0.02,
      "amount": 25
    }
  ]
}
'''

#http://localhost:5000/invoice/add
@app.route('/invoice/add', methods=['POST'])
def invoice_add():
    data = json.loads(request.data)

    sales_person_code = data['invoice']['sales_person_code']
    cutomer_name = data['invoice']['cutomer_name']
    cutomer_phone=data['invoice']['cutomer_phone']
    cutomer_vat_no =str(data['invoice']['cutomer_vat_no'])
    sub_total = data['invoice']['sub_total']
    discount = data['invoice']['discount']
    vat= data['invoice']['vat']
    total = data['invoice']['total']
    payment_mode = data['invoice']['payment_mode']
    query = "INSERT INTO invoice (invoice_date, invoice_time,  sales_person_code,cutomer_name,cutomer_phone,cutomer_vat_no,sub_total,discount,vat,total,payment_mode) VALUES (date(),time(),'%s','%s',%d,'%s',%f,%f,%f,%f,%d  )"% (sales_person_code,cutomer_name,cutomer_phone,cutomer_vat_no,sub_total,discount,vat,total,payment_mode)
    #print(query)

    run_insert_query(query)
    invoice_no = run_select_query('SELECT MAX(id) FROM invoice')[0][0]

    num_items = len(data['items'])
    for i in range(num_items):
        product_code = data['items'][i]['product_code']
        product_category = data['items'][i]['product_category']
        product_name = data['items'][i]['product_name']
        product_price = data['items'][i]['product_price']
        product_coo = data['items'][i]['product_coo']
        quantity = data['items'][i]['quantity']
        discount = data['items'][i]['discount']
        amount = data['items'][i]['amount']
        query = "INSERT INTO items (invoice_no,product_code,product_category,product_name,product_price,product_coo,quantity,discount,amount) VALUES  ('%s','%s','%s','%s',%f,'%s',%f,%f,%f)"% (invoice_no,product_code,product_category,product_name,product_price,product_coo,quantity,discount,amount)
        run_insert_query(query)

    return '1', 200

'''
select invoice.id,invoice.date,invoice.time,invoice.sales_person,invoice.cutomer_phone,items.product_category,items.product_name,items.product_price,items.quantity,items.amount,items.tax,invoice.total_amount,invoice.total_tax,invoice.payment_type from invoice,items where invoice.date >= '2010-05-15' and invoice.date <= '2018-05-15' 
'''
#http://localhost:5000/report/type=date,from='2015-05-15',to='2018-05-15'
#http://localhost:5000/report/type=sales_person_code,from='2015-05-15',to='2018-05-15'
#http://localhost:5000/report/type=payment_mode,from='2015-05-15',to='2018-05-15'
#http://localhost:5000/report/type=category,from='2015-05-15',to='2018-05-15'
@app.route('/report/type=<report_type>,from=<from_date>,to=<to_date>', methods=['GET'])
def report(report_type,from_date,to_date):
    if(str(report_type) == 'date'):

        query = 'select invoice.invoice_date ,' \
                'round(sum(invoice.sub_total),2) as sub_total,' \
                'round(sum(invoice.discount),2) as discount, ' \
                'round(sum(invoice.vat),2) as vat,' \
                'round(sum(invoice.total),2) as total ' \
                'from invoice,items ' \
                'where invoice.invoice_date  >= '+  from_date + ' and invoice.invoice_date  <= '+  to_date + ' group by invoice.invoice_date '

    elif(report_type=='sales_person_code'):
        query = 'select invoice.sales_person_code, invoice.invoice_date ,' \
                'round(sum(invoice.sub_total),2) as sub_total,' \
                'round(sum(invoice.discount),2) as discount, ' \
                'round(sum(invoice.vat),2) as vat,' \
                'round(sum(invoice.total),2) as total ' \
                'from invoice,items ' \
                'where invoice.invoice_date  >= '+  from_date + ' and invoice.invoice_date  <= '+  to_date + ' group by invoice.sales_person_code'

    elif(report_type=='payment_mode'):
        query = 'select invoice.payment_mode, invoice.invoice_date ,' \
                'round(sum(invoice.sub_total),2) as sub_total,' \
                'round(sum(invoice.discount),2) as discount, ' \
                'round(sum(invoice.vat),2) as vat,' \
                'round(sum(invoice.total),2) as total ' \
                'from invoice,items ' \
                'where invoice.invoice_date  >= '+  from_date + ' and invoice.invoice_date  <= '+  to_date + ' group by invoice.payment_mode'

    elif (report_type == 'category'):
        query = 'select items.product_category as category, invoice.invoice_date , ' \
                'round(sum(invoice.sub_total),2) as sub_total,' \
                'round(sum(invoice.discount),2) as discount, ' \
                'round(sum(invoice.vat),2) as vat,' \
                'round(sum(invoice.total),2) as total ' \
                'from invoice,items ' \
                'where invoice.invoice_date  >= ' + from_date + ' and invoice.invoice_date  <= ' + to_date + \
                ' and items.invoice_no=invoice.id group by items.product_category'
    #print(query)
    json_output = json.dumps(run_query(query))
    return json_output, 200
#http://localhost:5000/sales_person/login
# body : {"login": "Abdul","password":"abdul"}
@app.route('/sales_person/login', methods=['GET'])
def sales_person_login():
    data = json.loads(request.data)
    query = 'select count(*) as count from sales_person_master where login = "'+ data['login'] +'" and password = "' +data['password']+'"'
    result = run_query(query);
    count = result[0]['count']
    return str(count), 200

#http://localhost:5000/admin/login
@app.route('/admin/login', methods=['POST'])
# body : {"login": "Admin","password":"admin"}
def admin_login():
    data = json.loads(request.data)
    query = 'select count(*) as count from admin_lookup where login = "'+ data['login'] +'" and password = "' +data['password']+'"'
    print(query)
    result = run_query(query);
    count = result[0]['count']
    return str(count), 200

@app.route('/')
def home():
    return('Smart Shopper Application')


file_handler = logging.FileHandler('server.log')
app.logger.addHandler(file_handler)
app.logger.setLevel(logging.INFO)

PROJECT_HOME = os.path.dirname(os.path.realpath(__file__))
UPLOAD_FOLDER = '{}/uploads/'.format(PROJECT_HOME)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def create_new_folder(local_dir):
    newpath = local_dir
    if not os.path.exists(newpath):
        os.makedirs(newpath)
    return newpath

@app.route('/do_upload/desitnation_file_name=<file_name>', methods = ['POST'])
def do_upload(file_name):
    app.logger.info(PROJECT_HOME)
    if request.method == 'POST' and request.files['image']:
        app.logger.info(app.config['UPLOAD_FOLDER'])
        img = request.files['image']
        img_name = file_name
        create_new_folder(app.config['UPLOAD_FOLDER'])
        saved_path = os.path.join(app.config['UPLOAD_FOLDER'], img_name)
        app.logger.info("saving {}".format(saved_path))
        img.save(saved_path)
        return send_from_directory(app.config['UPLOAD_FOLDER'],img_name, as_attachment=True)
    else:
    	return "Where is the image?"

@app.route('/test_file_upload', methods=['GET'])
def test_file_upload():
    content = open('file_upload.html').read()
    return Response(content, mimetype="text/html")








@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin','*')
    #response.headers.add('Access-Control-Allow-Headers','Origin,Accept, X-Requested-With','Content-Type')
    response.headers.add('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS')
    return response

if __name__ == '__main__':
    app.run(host='localhost', port='5000')