'''
Compilation Steps: 
pyinstaller main.py
'''

import sqlite3
from flask import Flask, request,json,send_from_directory,Response,render_template,send_file, url_for
import logging, os, subprocess
from  db_utilities import *
import pdfkit
from num2words import num2words
import random
import requests

print_server_port = ""
print_server_port=""
main_server_port = ""
main_server_port=""
wkhtmltopdf= 'C:/Program Files/wkhtmltopdf/bin/wkhtmltopdf.exe'
acrobat_reader= 'C:/Program Files (x86)/Adobe/Acrobat Reader DC/Reader/AcroRd32.exe'
site='main'
config = pdfkit.configuration(wkhtmltopdf=wkhtmltopdf)

app = Flask(__name__,static_url_path = "", static_folder = "static")


#http://localhost:5000/product/all
@app.route('/product/all', methods=['GET'])
def product_all():
    query = 'select code, name, category from product_master'
    json_output = json.dumps(run_query(query))
    return json_output, 200
    #return Response(json_output, mimetype="application/json"), 200

#http://localhost:5000/product/full_all
@app.route('/product/full_all', methods=['GET'])
def product_full_all():
    query = 'select * from product_master'
    json_output = json.dumps(run_query(query))
    return json_output, 200

#http://localhost:5000/stock/full_all
@app.route('/stock/full_all', methods=['GET'])
def stock_full_all():
    query = 'select * from stock_master'
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

#http://localhost:5000/product/category='Floral'
@app.route('/product/category=<category>', methods=['GET'])
def product_by_category(category):
    query = 'select code, name from product_master where category = '+ category
    json_output = json.dumps(run_query(query))
    return json_output, 200


#http://localhost:5000/product/name='Romance'
@app.route('/product/name=<name>', methods=['GET'])
def product_by_name(name):
    query = 'select * from product_master where name = '+ name
    json_output = json.dumps(run_query(query,[name]))
    return json_output, 200

#http://localhost:5000/product/code='1'
@app.route('/product/code=<code>', methods=['GET'])
def product_by_code(code):
    query = 'select * from product_master where code = '+ code
    json_output = json.dumps(run_query(query))
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

# call main server get rest api to get invoice data
#http://localhost:5001/invoice_print/invoice_no=1
@app.route('/invoice_print/invoice_no=<invoice_no>', methods=['GET'])
def get_invoice_data(invoice_no):
    url = 'http://'+main_server_host+':'+main_server_port+ '/invoice/get_invoice_header/invoice_no='+invoice_no
    invoice_header = requests.get(url).json()
    url = 'http://'+main_server_host+':'+main_server_port+ '/invoice/get_invoice_items/invoice_no='+invoice_no
    invoice_items = requests.get(url).json()
    num_items = len(invoice_items)
    url = 'http://'+main_server_host+':'+main_server_port+ '/invoice/get_invoice_total/invoice_no='+invoice_no
    total_string = requests.get(url).json()
    total_string = num2words(total_string[0]['total']).title()
    data = render_template('invoice_new.html', invoice_header=invoice_header[0],invoice_items=invoice_items, num_items=num_items,total_string=total_string)
    s = "abcdefghijklmnopqrstuvwxyz01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    pdf_filename = "invoice_"+ "".join(random.sample(s, 10))+'.pdf'
    print(pdf_filename)
    pdfkit.from_string(data, 'temp/'+pdf_filename, configuration=config)
    #os.startfile('invoice.pdf')
    # AcroRd32.exe /t filename.pdf printername drivername portname
    acroread = acrobat_reader +' /H /T'
    print (acroread)
    printer=""
    cmd = '%s %s' % (acroread, 'temp/'+pdf_filename)
    #print (cmd)
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    #stdout, stderr = proc.communicate()
    #exit_code = proc.wait()
    return '1', 200

# service to get invoice data from db
#http://localhost:5000/invoice/get_invoice_header/invoice_no=1
@app.route('/invoice/get_invoice_header/invoice_no=<invoice_no>', methods=['GET'])
def get_invoice_header(invoice_no):
    query = 'select * from invoice where id = '+ invoice_no
    return json.dumps(run_query(query)), 200

#http://localhost:5000/invoice/get_invoice_items/invoice_no=1
@app.route('/invoice/get_invoice_items/invoice_no=<invoice_no>', methods=['GET'])
def get_invoice_items(invoice_no):
    query = 'select * from items where invoice_no  = '+ invoice_no
    return json.dumps(run_query(query)), 200

#http://localhost:5000/invoice/get_invoice_total/invoice_no=1
@app.route('/invoice/get_invoice_total/invoice_no=<invoice_no>', methods=['GET'])
def get_invoice_total(invoice_no):
    query = 'select total from invoice where id = '+ invoice_no
    return json.dumps(run_query(query)), 200

#http://localhost:5000/invoice_print_old/invoice_no=1
@app.route('/invoice_print_old/invoice_no=<invoice_no>', methods=['GET'])
def invoice_print_by_id1(invoice_no):
    query = 'select * from invoice where id = '+ invoice_no
    invoice_header = json.loads(json.dumps(run_query(query)))
    query = 'select * from items where invoice_no  = '+ invoice_no
    invoice_items = json.loads(json.dumps(run_query(query)))
    num_items = len(invoice_items)
    query = 'select total from invoice where id = '+ invoice_no
    total_string = json.loads(json.dumps(run_query(query)))
    total_string = num2words(total_string[0]['total']).title()
    data = render_template('invoice_new.html', invoice_header=invoice_header[0],invoice_items=invoice_items, num_items=num_items,total_string=total_string)
    s = "abcdefghijklmnopqrstuvwxyz01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    pdf_filename = "invoice_"+ "".join(random.sample(s, 10))+'.pdf'
    print(pdf_filename)
    pdfkit.from_string(data, 'temp/'+pdf_filename, configuration=config)
    #os.startfile('invoice.pdf')
    # AcroRd32.exe /t filename.pdf printername drivername portname
    acroread = acrobat_reader +' /H /T'
    print (acroread)
    printer=""
    cmd = '%s %s' % (acroread, 'temp/'+pdf_filename)
    #print (cmd)
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    #stdout, stderr = proc.communicate()
    #exit_code = proc.wait()
    return '1', 200


''' ------------------------------------BODY JSON-------------------------------------------------------------
{
  "invoice": {
  "id": 2,
  "sales_person_code": "ASDF",
  "customer_name": "ABC Corp.",
  "customer_phone": "99-99-99",
  "customer_vat_no": "00-00",
  "sub_total": 0.02,
  "discount": 0.02,
  "vat": 0.02,
  "total": 25,
  "payment_mode": 1,
  "status": 1,
  "notes": "-"
  },
  "items": [
    {
      "id": 1,
      "product_code": "1",
      "product_category": "Floral",
      "product_name": "Diasy",
	  "product_name_arabic": "Diasy",
	  "product_brand": "Diasy",
	  "product_type": "Diasy",
      "product_coo": "India",
      "product_price": 2.54,
      "quantity": 12,
      "vat": 1.0,
      "discount": 0.02,
      "amount": 25
    },
    {
      "id": 2,
      "product_code": "1",
      "product_category": "Floral",
      "product_name": "Diasy",
	  "product_name_arabic": "Diasy",
	  "product_brand": "Diasy",
	  "product_type": "Diasy",
      "product_coo": "India",
      "product_price": 2.54,
      "quantity": 12,
      "vat": 1.0,
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
    print(data)

    sales_person_code = data['invoice']['sales_person_code']
    customer_name = data['invoice']['customer_name']
    customer_phone=data['invoice']['customer_phone']
    customer_vat_no =data['invoice']['customer_vat_no']
    sub_total = data['invoice']['sub_total']
    discount = data['invoice']['discount']
    vat= data['invoice']['vat']
    total = data['invoice']['total']
    payment_mode = data['invoice']['payment_mode']
    status = data['invoice']['status']
    notes = data['invoice']['notes']

    query = "INSERT INTO invoice (invoice_date, invoice_time,  sales_person_code,customer_name,customer_phone,customer_vat_no,sub_total,discount,vat,total,payment_mode,status,notes) VALUES (date(),time(),'%s','%s','%s','%s',%f,%f,%f,%f,%d , %d,'%s' )"% (sales_person_code,customer_name,customer_phone,customer_vat_no,sub_total,discount,vat,total,payment_mode,status,notes)
    print(query)
    run_insert_query(query)
    invoice_no = run_select_query('SELECT MAX(id) FROM invoice')[0][0]

    num_items = len(data['items'])
    for i in range(num_items):
        product_code = data['items'][i]['product_code']
        product_category = data['items'][i]['product_category']
        product_name = data['items'][i]['product_name']
        product_name_arabic = data['items'][i]['product_name_arabic']
        product_brand = data['items'][i]['product_brand']
        product_type = data['items'][i]['product_type']
        product_coo = data['items'][i]['product_coo']
        product_price = float(data['items'][i]['product_price'])
        quantity = float(data['items'][i]['quantity'])
        vat = float(data['items'][i]['vat'])
        print('vat: ',vat)
        discount = float(data['items'][i]['discount'])
        amount = float(data['items'][i]['amount'])
        query = "INSERT INTO items (invoice_no,product_code,product_category,product_name,product_name_arabic,product_brand,product_type,product_price,product_coo,quantity,discount,amount,vat) VALUES  ('%s','%s','%s','%s','%s','%s','%s',%f,'%s',%f,%f,%f,%f)"% (invoice_no,product_code,product_category,product_name,product_name_arabic,product_brand,product_type,product_price,product_coo,quantity,discount,amount,vat)
        #query = "INSERT INTO items (invoice_no,product_code,product_category,product_name,product_name_arabic,product_brand,product_type,product_price,product_coo,quantity,discount,amount) VALUES  ('%s','%s','%s','%s','%s','%s','%s',%f,'%s',%f,%f,%f)"% (invoice_no,product_code,product_category,product_name,product_name_arabic,product_brand,product_type,product_price,product_coo,quantity,discount,amount)
        print(query)
        run_insert_query(query)

    return  str(invoice_no), 200


# Invoice update by changing the status and adding comment
'''
{
  "invoice": {
  "status": 1,
  "comments": "-"
  }
}
'''
#http://localhost:5000/invoice/update/invoice_no=1
@app.route('/invoice/update/invoice_no=<invoice_no>', methods=['POST'])
def invoice_update(invoice_no):
    data = json.loads(request.data)
    status = data['invoice']['status']
    comments=data['invoice']['comments']
    query = "UPDATE invoice SET status =%d, comments='%s' WHERE id=%s" % (status, comments, invoice_no)
    run_insert_query(query)
    return '1', 200
'''
 {
 	"product": {
 		"category": "Floral",
 		"code": "11",
 		"name": "Daisy",
 		"name_arabic": "Daisy",
 		"brand": "Marc Jacobs",
 		"product_type": "Perfume1",
 		"coo": "India",
 		"price": 2.54,
 		"image": "a.png",
 		"status": 1
 	}
 }
'''
#http://localhost:5000/product/add
@app.route('/product/add', methods=['POST'])
def product_add():
    data = json.loads(request.data)
    code = data['product']['code']
    category = data['product']['category']
    name=data['product']['name']
    name_arabic =data['product']['name_arabic']
    brand = data['product']['brand']
    product_type = data['product']['product_type']
    coo= data['product']['coo']
    price = data['product']['price']
    image = data['product']['image']
    status = data['product']['status']
    data = run_select_query('select * from product_master where code = '+ code)
    if (len(data)>0):
        return '0', 200
    query = "INSERT INTO product_master (category, code, name, name_arabic, brand, product_type, coo, price, image, status) VALUES ('%s','%s','%s','%s','%s','%s','%s',%f,'%s',%d)"% (category, code, name, name_arabic, brand, product_type, coo, price, image, status)
    #print(query)
    run_insert_query(query)
    product_id = run_select_query('SELECT MAX(id) FROM product_master')[0][0]

    return str(product_id), 200

#http://localhost:5000/product/update/product_code=1
@app.route('/product/update/product_code=<product_code>', methods=['POST'])
def product_update(product_code):
    data = json.loads(request.data)
    category = data['product']['category']
    name=data['product']['name']
    name_arabic =data['product']['name_arabic']
    brand = data['product']['brand']
    product_type = data['product']['product_type']
    coo= data['product']['coo']
    price = data['product']['price']
    image = data['product']['image']
    status = data['product']['status']
    query = "UPDATE product_master SET category ='%s', name='%s', name_arabic='%s', brand='%s', product_type='%s', coo='%s', price=%f, image='%s', status=%d WHERE code='%s'" % (category, name, name_arabic, brand, product_type, coo, price, image, status,product_code)
    run_insert_query(query)
    return '1', 200

#http://localhost:5000/product/delete/code=1
@app.route('/product/delete/code=<code>', methods=['GET'])
def product_delete(code):
    query = "DELETE FROM product_master where code="+str(code)
    run_insert_query(query)
    return '1', 200


'''
 {
 	"stock": {
 		"stock_entry_date": "2016-03-09",
 		"product_code": "11",
 		"product_name": "Daisy",
 		"product_category": "Floral",
 		"product_brand": "Dior",
 		"product_type": "Perfume1",
 		"product_coo": "India",
 		"quantity": 2.54
 	}
 }
'''
#http://localhost:5000/stock/add
@app.route('/stock/add', methods=['POST'])
def stock_add():
    data = json.loads(request.data)
    print(data)

    stock_entry_date = data['stock']['stock_entry_date']
    product_code=data['stock']['product_code']
    product_name =data['stock']['product_name']
    product_category = data['stock']['product_category']
    product_brand = data['stock']['product_brand']
    product_type= data['stock']['product_type']
    product_coo = data['stock']['product_coo']
    quantity = data['stock']['quantity']

    query = "INSERT INTO stock_master (stock_entry_date,product_code,product_name,product_category,product_brand,product_type,product_coo,quantity) VALUES ('%s','%s','%s','%s','%s','%s','%s',%f)"% (stock_entry_date,product_code,product_name,product_category,product_brand,product_type,product_coo,quantity)
    #print(query)
    run_insert_query(query)
    return '1', 200

#http://localhost:5000/stock/delete/id=1
@app.route('/stock/delete/id=<id>', methods=['GET'])
def stock_delete(id):
    query = "DELETE FROM stock_master where id="+str(id)
    run_insert_query(query)
    return '1', 200



'''
 {
 	"sales_person": {
 		"name": "Ali S",
 		"code": "AS11",
 		"contact_number": "99999999",
 		"login": "Ali",
 		"password": "ali"
 	}
 }
'''


#http://localhost:5000/sales_person/add
@app.route('/sales_person/add', methods=['POST'])
def sales_person_add():
    data = json.loads(request.data)

    name = data['sales_person']['name']
    code=data['sales_person']['code']
    contact_number =data['sales_person']['contact_number']
    login = data['sales_person']['login']
    password = data['sales_person']['password']

    # check for unique constraint
    data = run_select_query('select * from sales_person_master where login = "'+ login+'"')
    if (len(data)>0):
        return '0', 200

    data = run_select_query('select * from sales_person_master where code = "'+ code+'"')
    if (len(data)>0):
        return '0', 200

    query = "INSERT INTO sales_person_master (name,code,contact_number,login,password) VALUES ('%s','%s','%s','%s','%s')"% (name,code,contact_number,login,password)
    #print(query)
    run_insert_query(query)
    return '1', 200

#http://localhost:5000/sales_person/delete/id=1
@app.route('/sales_person/delete/id=<id>', methods=['GET'])
def sales_person_delete(id):
    query = "DELETE FROM sales_person_master where id="+str(id)
    run_insert_query(query)
    return '1', 200

#http://localhost:5000/sales_person/all
@app.route('/sales_person/all', methods=['GET'])
def sales_person_all():
    query = 'select name, code, contact_number, login, password  from sales_person_master'
    json_output = json.dumps(run_query(query))
    return json_output, 200

'''
        query = 'select invoice.invoice_date ,' \
                'round(sum(invoice.sub_total),2) as sub_total,' \
                'round(sum(invoice.discount),2) as discount, ' \
                'round(sum(invoice.vat),2) as vat,' \
                'round(sum(invoice.total),2) as total ' \
                'from invoice,items ' \
                'where invoice.invoice_date  >= '+  from_date + ' and invoice.invoice_date  <= '+  to_date + ' group by invoice.invoice_date '
'''
#http://localhost:5000/report/type='date',from='2015-05-15',to='2018-05-15',file_type='pdf','csv','none'
#http://localhost:5000/report/type='sales_person',from='2015-05-15',to='2018-05-15',file_type='pdf','csv','none'
#http://localhost:5000/report/type='payment_mode',from='2015-05-15',to='2018-05-15',file_type='pdf','csv','none'
#http://localhost:5000/report/type='category',from='2015-05-15',to='2018-05-15',file_type='pdf','csv','none'
@app.route('/report/type=<report_type>,from=<from_date>,to=<to_date>,file_type=<file_type>', methods=['GET'])
def report(report_type,from_date,to_date,file_type):
    if(str(report_type) == "'date'"):
        cols = ["type", "invoice_date", "sub_total", "vat", "discount", "total"]
        query = 'select distinct invoice_date from invoice  where invoice_date  >= ' + from_date + ' and invoice_date  <= '+  to_date + ' order by invoice_date'
        invoice_date_list = run_query(query)
        report_data =[]
        for invoice_date in invoice_date_list:
            print (invoice_date['invoice_date'])
            query = 'select "" as type, invoice_date ,' \
                    'round(sub_total,2) as sub_total,' \
                    'round(discount,2) as discount, ' \
                    'round(vat,2) as vat,' \
                    'round(total,2) as total ' \
                    'from invoice ' \
                    'where invoice_date = "'+ invoice_date['invoice_date']+'"'
            report_data = report_data + run_query(query)
            query = 'select "Summary" as type,  invoice_date ,' \
                    'round(sum(sub_total),2) as sub_total,' \
                    'round(sum(discount),2) as discount, ' \
                    'round(sum(vat),2) as vat,' \
                    'round(sum(total),2) as total ' \
                    'from invoice ' \
                    'where invoice_date = "'+ invoice_date['invoice_date'] + '" group by invoice_date;'
            report_data = report_data + run_query(query)

    elif(report_type=="'sales_person'"):
        cols = ["type","sales_person_code",  "invoice_date", "sub_total", "vat", "discount", "total"]
        query = 'select distinct sales_person_code from invoice  where invoice.invoice_date  >= ' + from_date + ' and invoice.invoice_date  <= '+  to_date + ' order by sales_person_code'
        sales_person_list = run_query(query)
        report_data =[]
        for sales_person in sales_person_list:
            print (sales_person['sales_person_code'])
            query = 'select "" as type, sales_person_code, invoice_date ,' \
                    'round(sub_total,2) as sub_total,' \
                    'round(discount,2) as discount, ' \
                    'round(vat,2) as vat,' \
                    'round(total,2) as total ' \
                    'from invoice ' \
                    'where  invoice_date  >= ' + from_date + ' and invoice_date  <= '+  to_date + ' and sales_person_code = "'+ sales_person['sales_person_code']+'" order by invoice_date'
            report_data = report_data + run_query(query)
            query = 'select "Summary" as type, sales_person_code, invoice_date ,' \
                    'round(sum(sub_total),2) as sub_total,' \
                    'round(sum(discount),2) as discount, ' \
                    'round(sum(vat),2) as vat,' \
                    'round(sum(total),2) as total ' \
                    'from invoice ' \
                    'where invoice_date  >= ' + from_date + ' and invoice_date  <= '+  to_date + ' and sales_person_code = "'+ sales_person['sales_person_code'] + '" group by sales_person_code order by invoice_date'
            report_data = report_data + run_query(query)


    elif(report_type=="'payment_mode'"):
        cols = ["type","payment_mode",  "invoice_date", "sub_total", "vat", "discount", "total"]
        query = 'select distinct payment_mode from invoice  where invoice_date  >= ' + from_date + ' and invoice_date  <= '+  to_date + ' order by payment_mode'
        payment_mode_list = run_query(query)
        report_data =[]
        for payment_mode in payment_mode_list:
            print (payment_mode['payment_mode'])
            query = 'select "" as type, payment_mode, invoice_date ,' \
                    'round(sub_total,2) as sub_total,' \
                    'round(discount,2) as discount, ' \
                    'round(vat,2) as vat,' \
                    'round(total,2) as total ' \
                    'from invoice ' \
                    'where  invoice_date  >= ' + from_date + ' and invoice_date  <= '+  to_date + ' and payment_mode = '+ str(payment_mode['payment_mode'])+' order by invoice_date'
            report_data = report_data + run_query(query)
            query = 'select "Summary" as type, payment_mode, invoice_date ,' \
                    'round(sum(sub_total),2) as sub_total,' \
                    'round(sum(discount),2) as discount, ' \
                    'round(sum(vat),2) as vat,' \
                    'round(sum(total),2) as total ' \
                    'from invoice ' \
                    'where invoice_date  >= ' + from_date + ' and invoice_date  <= '+  to_date + ' and payment_mode = '+ str(payment_mode['payment_mode']) + ' group by payment_mode order by invoice_date'
            report_data = report_data + run_query(query)

    elif (report_type == "'category'"):
        cols = ["type","category",  "invoice_date", "sub_total", "vat", "discount", "total"]

        query = 'select distinct items.product_category as category from invoice,items  where invoice.invoice_date  >= ' + from_date + ' and invoice.invoice_date  <= ' + to_date + ' and items.invoice_no=invoice.id order by items.product_category'
        category_list = run_query(query)
        report_data = []
        for category in category_list:
            print(category['category'])
            query = 'select "" as type,items.product_category as category, invoice.invoice_date , ' \
                    'round(invoice.sub_total,2) as sub_total,' \
                    'round(invoice.discount,2) as discount, ' \
                    'round(invoice.vat,2) as vat,' \
                    'round(invoice.total,2) as total ' \
                    'from invoice,items ' \
                    'where invoice.invoice_date  >= ' + from_date + ' and invoice.invoice_date  <= ' + to_date + \
                    ' and items.invoice_no=invoice.id and product_category = "' + category['category'] + '" order by invoice_date'
            report_data = report_data + run_query(query)

            query = 'select "Summary" as type, items.product_category as category, invoice.invoice_date , ' \
                    'round(sum(invoice.sub_total),2) as sub_total,' \
                    'round(sum(invoice.discount),2) as discount, ' \
                    'round(sum(invoice.vat),2) as vat,' \
                    'round(sum(invoice.total),2) as total ' \
                    'from invoice,items ' \
                    'where invoice.invoice_date  >= ' + from_date + ' and invoice.invoice_date  <= ' + to_date + \
                    ' and items.invoice_no=invoice.id and product_category = "' + category['category'] + '" group by items.product_category order by invoice_date'
            report_data = report_data + run_query(query)

    if (file_type=="'pdf'"):
        import pdfkit
        report_json = json.loads(json.dumps((report_data)))
        data = render_template('report.html', report_type=report_type,cols = cols, report_json=report_json )
        pdfkit.from_string(data, 'temp/report.pdf', configuration=config)
        return send_file('temp/report.pdf', as_attachment=True),200

    if (file_type=="'csv'"):
        fp = open("temp/file.csv", "w")
        fp.write('Ard Al Zaafaran Trading - '+report_type +' wise Report\n\n')

        for col in cols:
            fp.write(col+',')
        fp.write('\n')

        for row in range(len(report_data)):
            for col in cols:
                fp.write(str(report_data[row][col])+',')
            fp.write('\n')
            if (report_data[row]['type'] == 'Summary'):
                fp.write('\n')

        fp.close()
        return send_file('temp/file.csv', as_attachment=True),200


    json_output = json.dumps(report_data)
    return json_output, 200


#http://localhost:5000/product/file_download/code=2
@app.route('/product/file_download/code=<code>', methods=['GET'])
def product_file_download_by_code(code):
    return send_file('images/'+code+'.jpg', as_attachment=True), 200

#http://localhost:5000/sales_person/login
# body : {"login": "Abdul","password":"abdul"}
@app.route('/sales_person/login', methods=['POST'])
def sales_person_login():
    data = json.loads(request.data)
    query = 'select count(*) as count from sales_person_master where login = "'+ data['login'] +'" and password = "' +data['password']+'"'
    result = run_query(query)
    count = result[0]['count']
    return str(count), 200

#http://localhost:5000/admin/login
@app.route('/admin/login', methods=['POST'])
# body : {"login": "Admin","password":"admin"}
def admin_login():
    data = json.loads(request.data)
    query = 'select count(*) as count from admin_lookup where login = "'+ data['login'] +'" and password = "' +data['password']+'"'
    print(query)
    result = run_query(query)
    count = result[0]['count']
    return str(count), 200

#http://localhost:5000/store/details/login="Abdul"
@app.route('/store/details/login=<login>', methods=['GET'])
def store_details(login):
    query = 'select inv_stores.storeid, inv_stores.storename, inv_stores.addressone,inv_stores.addresstwo, inv_stores.city, inv_stores.zip, inv_stores.phone from inv_stores, user_store_map, sales_person_master where sales_person_master.login = ' +login + ' and sales_person_master.id = user_store_map.userid and inv_stores.storeid = user_store_map.storeid; '
    print(query)
    json_output = json.dumps(run_query(query))
    return json_output, 200



#http://localhost:5000/product/full_all_new/storename='SharjaStore'
@app.route('/product/full_all_new/storename=<storename>', methods=['GET'])
def full_all_new(storename):
    query = 'select pm.id,pm.code,pm.barcode,pm.name,pm.category,pm.brand,pm.product_type,pm.coo,pm.price,ifnull(A.GRN_QTY,0)+ifnull(E.RET_QTY,0)+ifnull(C.TRF_IN_QTY,0)-ifnull(B.TRF_OUT_QTY,0)-ifnull(D.INV_QTY,0) BAL_QTY from product_master pm left join ( select sku,sum(qtyreceived) GRN_QTY from receipt_header rh,receipt_details rd where rh.receiptkey=rd.receiptkey and rh.storename="SharjaStore" and rh.status=1 group by sku ) A on pm.code=A.sku LEFT JOIN ( select sku,sum(quantity) TRF_OUT_QTY from transfer_header th,transfer_details td where th.documentno=td.documentno and th.transferfrom="SharjaStore" group by sku ) B on pm.code=B.sku LEFT JOIN ( select sku,sum(quantity) TRF_IN_QTY from transfer_header th,transfer_details td where th.documentno=td.documentno and th.transferto="SharjaStore" group by sku ) C  on pm.code=C.sku LEFT JOIN ( select product_code,sum(quantity)  INV_QTY from invoice inv , items it where inv.id = it.invoice_no and inv.storename="SharjaStore" group by product_code) D  on pm.code=D.product_code LEFT JOIN ( select sku,sum(quantity) RET_QTY from returned_items where storename= '+ storename +' group by sku) E  on pm.code=E.sku; '
    
    json_output = json.dumps(run_query(query))
    return json_output, 200

@app.route('/')
def home():
    return('Smart Shopper Application')


file_handler = logging.FileHandler('server.log')
app.logger.addHandler(file_handler)
app.logger.setLevel(logging.INFO)

PROJECT_HOME = os.path.dirname(os.path.realpath(__file__))
UPLOAD_FOLDER = '{}/images/'.format(PROJECT_HOME)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def create_new_folder(local_dir):
    newpath = local_dir
    if not os.path.exists(newpath):
        os.makedirs(newpath)
    return newpath

@app.route('/do_upload/destination_file_name=<file_name>', methods = ['POST'])
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
    content = open('templates/file_upload.html').read()
    return Response(content, mimetype="text/html")

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin','*')
    response.headers.add('Access-Control-Allow-Headers','Origin,Accept,X-Requested-With,Content-Type')
    response.headers.add('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS')
    return response

def load_properties(filepath, sep=':', comment_char='#'):
    """
    Read the file passed as parameter as a properties file.
    """
    props = {}
    with open(filepath, "rt") as f:
        for line in f:
            l = line.strip()
            if l and not l.startswith(comment_char):
                key_value = l.split(sep)
                key = key_value[0].strip()
                value = sep.join(key_value[1:]).strip().strip('"')
                props[key] = value
    return props

if __name__ == '__main__':
    props = load_properties('config_file.txt')
    for prop in props:
        if(prop=='site'): site =props[prop]
        if(prop=='main_server_host'): main_server_host =props[prop]
        if(prop=='main_server_port'): main_server_port =props[prop]

        if(prop=='print_server_host'): print_server_host =props[prop]
        if(prop=='print_server_port'): print_server_port =props[prop]

        if(prop=='wkhtmltopdf'): wkhtmltopdf =props[prop]
        if(prop=='acrobat_reader'): acrobat_reader =props[prop]

    if(site=='main'):
        app.run(host=main_server_host, port=main_server_port)
    elif(site=='print'):
        app.run(host=print_server_host, port=print_server_port)
