# import necessary libraries
from sqlalchemy import func, create_engine
from flask import (
    Flask,render_template,
    jsonify,request,redirect)
import pandas as pd
import bs4
import json
import pymysql



pymysql.install_as_MySQLdb()

app = Flask(__name__)

# --- Connect to MySql
engine = create_engine(f"mysql://{remote_db_user}:{remote_db_pwd}@{remote_db_endpoint}/{remote_db_name}")

# ---------------------------- HOMEPAGE ------------------------------------
@app.route("/")
def home():
    return render_template("index.html")

# -------------------------- SBA DATA ENDPOINTS ---------------------------
@app.route("/api/sba_loan_detail")
def sba_startup():
    conn = engine.connect()

    query = '''
        SELECT
            *
        FROM
            sba_loan_detail
        Limit 10000
    '''

    sba_df = pd.read_sql(query, con=conn)
    sba_json = sba_df.to_json(orient='index')
    conn.close()

    return sba_json

# ------------------------ MAP ENDPOINTS ------------------------------------
@app.route("/api/sba_by_state_approvals")
def fy_state_approvals():

    with open('us-states-with-loan-data.json') as json_file:
        sba_json = json.load(json_file)
        # print(sba_json)

    return sba_json

# -------------------------- MAP PAGE ------------------------------------
@app.route("/loanmap")
def loan_map():
    return render_template("map.html")

# ---------------------------- JOB SUPPORTED ------------------------------
@app.route("/api/jobs_suppported")
def jobs_supported():
    conn = engine.connect()

    query = '''
        SELECT
            BankName,
            JobsSupported,
            GrossApproval
        FROM
            sba_loan_detail
        GROUP BY
            BankName
        Limit 100
    '''

    jobs_df = pd.read_sql(query, con=conn)
    jobs_json = jobs_df.to_json(orient='records')
    conn.close()

    return jobs_json

# -------------------------- LOAN Frequency ENDPOINTS -------------------------
@app.route("/loan_frequency")
def loan_freq():
    conn = engine.connect()

    query = '''
        SELECT
        	ApprovalFiscalYear as Year,
        	NaicsCode, NaicsDescription as Industry_Classification,
        	count(NaicsDescription) as Industry_Counts
        FROM `sba-schema`.sba_loan_detail
        GROUP BY Year,NaicsDescription
        ORDER BY Year,Industry_Counts DESC
    '''

    sba_df = pd.read_sql(query, con=conn)
    sba_json = sba_df.to_json(orient='records')
    conn.close()

    return sba_json

# ------------------------ TOP10 Industry Chart PAGE --------------------------
@app.route("/top10industry")
def top10_industry():
    return render_template("industry_class.html")



# ------------------------ MAP ENDPOINTS ------------------------------------
@app.route("/states_gdp")
def st_gdp():

    with open('gdp12to19.json') as json_file:
        st_json = json.load(json_file)

    return jsonify(st_json)

# ------------------------ BAR CHART RACE -----------------------------------
@app.route('/barchartrace_sample')
def barchartrace():
    conn = engine.connect()

    query = '''
            SELECT
            	ApprovalFiscalYear
            	,BorrName
            	,SUM(GrossApproval) AS GrossApproval
            	,NaicsDescription
            FROM
            	sba_loan_detail
            GROUP BY
            	BorrName
                ,NaicsDescription
            ORDER BY
            	ApprovalFiscalYear
                ,BorrName
                ,SUM(GrossApproval) DESC;
    '''

    data_df = pd.read_sql(query, con=conn)
    data_json = data_df.to_json(orient='records')
    conn.close()

    return data_json



# @app.route("/send", methods=["GET", "POST"])
# def send():
#     conn = engine.connect()

#     if request.method == "POST":
#         name = request.form["petName"]
#         pet_type = request.form["petType"]
#         age = request.form["petAge"]

#         pets_df = pd.DataFrame({
#             'name': [name],
#             'type': [pet_type],
#             'age': [age]
#         })

#         pets_df.to_sql('pets', con=conn, if_exists='append', index=False)

#         return redirect("/", code=302)

#     conn.close()

#     return render_template("form.html")




if __name__ == "__main__":
    app.run(debug=True)