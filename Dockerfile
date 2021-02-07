FROM node:15-alpine as frontend
WORKDIR /src
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn
COPY ./frontend/public/ ./public/
COPY ./frontend/src/ ./src/
RUN yarn run build

FROM python:3.8-alpine
WORKDIR /src
COPY backend/requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY backend/*.py ./
ENV FLASK_APP=notes.py FLASK_RUN_HOST=0.0.0.0
EXPOSE 5000
COPY --from=frontend /src/build build
CMD ["flask","run"]

