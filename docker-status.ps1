$env:PATH = "C:\Program Files\Docker\Docker\resources\bin;C:\Program Files\nodejs;" + $env:PATH
Set-Location "C:\Users\Reza\Projects\Patient Health"
docker compose -f infra/docker/docker-compose.yml ps
