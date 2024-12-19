from airflow import DAG
from airflow.providers.apache.hdfs.hooks.webhdfs import WebHDFSHook
from airflow.operators.bash_operator import BashOperator
from datetime import datetime

default_args = {
    'owner': 'airflow',
    'start_date': datetime(2023, 1, 1),
    'retries': 1,
}

with DAG('recommendation_etl_dag', default_args=default_args, schedule_interval=None) as dag:

    # Step to run the JavaScript ETL pipeline
    run_etl = BashOperator(
        task_id='run_etl',
        bash_command='node /opt/airflow/dags/recommendation_etl.js',  # Path to your script
    )

    run_etl
