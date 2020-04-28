FROM pyram1de/nodejs:latest as builder
COPY . /app
WORKDIR /app
RUN npm ci
RUN npm run deploy
WORKDIR /app/dist
COPY web.config .


FROM pyram1de/iisrewrite
RUN powershell -NoProfile -Command Remove-Item -Recurse C:\inetpub\wwwroot\*

WORKDIR /inetpub/wwwroot

COPY --from=builder "C:/app/dist" .

WORKDIR /ssl

COPY --from=builder "C:/app/ssl" .

RUN powershell Set-ExecutionPolicy Unrestricted
RUN powershell ./ssl2.ps1

EXPOSE 80
EXPOSE 443
