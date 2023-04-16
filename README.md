# Social media app


## docker

```
docker build -t s-media . && docker run -p 5000:5000 s-media
```

```
docker-compose up
```


```
docker build -f development.Dockerfile -t my-app:development .
docker build -f production.Dockerfile -t my-app:production .

docker-compose -f development.docker-compose.yml up
docker-compose -f production.docker-compose.yml up

```