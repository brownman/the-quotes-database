# The Lyrics Database  
```
run from the CLI:
-----------------
docker-compose up #that should spin up dockers for node.js, elastic & kibana

- Kibana dev console:
http://localhost:5601/app/dev_tools#/console?_g=()

- Web-server Endpoints:
----------------------
- create index: "lyrics" and populate with data:
http://localhost:8080/create_index

- delete index: "lyrics"
http://localhost:8080/delete_index

- Try different queries and get scored results: 
- Scored higher than 1:
http://localhost:8080/look_for_song?lyrics=like+magnet
http://localhost:8080/look_for_song?lyrics=like+maget
http://localhost:8080/look_for_song?lyrics=like+magnek
http://localhost:8080/look_for_song?lyrics=like+magnets
-
- Scored less than 1 (And therefore filtered out by the min_score query parameter):
http://localhost:8080/look_for_song?lyrics=lyke+mag

- create new document using Curl:
curl --request POST \
     --url http://localhost:8080/new \
     --header 'content-type: application/json' \
     --data '{
        "artist": "some artist",
        "title": "some title",
        "lyrics": "some lyrics"
}'
```
