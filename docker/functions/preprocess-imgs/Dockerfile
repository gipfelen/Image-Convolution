FROM python:3.7

WORKDIR /usr/src/app
COPY * .
RUN apt-get update && apt-get install -y python3-opencv
RUN pip3 install --no-cache-dir -r requirements.txt
ENTRYPOINT ["python", "lambda_function.py" ]