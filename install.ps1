$env:PATH = "C:\Program Files\Docker\Docker\resources\bin;C:\Program Files\nodejs;" + $env:PATH
Set-Location "C:\Users\Reza\Projects\Patient Health"
npm install --workspace=apps/emr @types/uuid@^10.0.0 --save-dev
