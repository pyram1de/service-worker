FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-env
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY . ./
RUN dotnet publish -c Release -o out

# Build runtime image
FROM windows-powershell-dotnetcore:latest
WORKDIR /ssl
COPY ./ssl . 

RUN PowerShell Set-ExecutionPolicy Unrestricted
RUN PowerShell ./webapi-ssl.ps1


WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "api.dll"]
 