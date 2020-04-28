Write-Output "do the administration stuff..."
#Import-Module IISAdministration;
#Import-Module WebAdministration;

#New-Website -Name 'webapi' -IPAddress '*' -Port 443 -PhysicalPath C:\inetpub\wwwroot -ApplicationPool '.NET v4.5' -Ssl -SslFlags 0  
#New-Website -Name 'Default Web Site' -IPAddress '*' -Port 443 -PhysicalPath 'C:/app' -ApplicationPool '.NET v4.5' -Ssl -SslFlags 0 
#$pfx = new-object System.Security.Cryptography.X509Certificates.X509Certificate2 
#$certPath = "myCertificate.pfx"
#$pfxPass = ConvertTo-SecureString -String 'theking' -Force -AsPlainText;
#$pfx.import($certPath,$pfxPass,"Exportable,PersistKeySet,MachineKeySet") 
#$store = new-object System.Security.Cryptography.X509Certificates.X509Store("My", "LocalMachine")
#$store.open("MaxAllowed") 
#$store.add($pfx) 
#$store.close()

#Import-Certificate -FilePath myCA.crt -CertStoreLocation cert:\CurrentUser\Root

$cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2("myCA.pem")
$rootStore = Get-Item cert:\LocalMachine\Root
$rootStore.Open("ReadWrite")
$rootStore.Add($cert)
$rootStore.Close()

# If you have a password on your SSL Cert, put it here as it needs "secured". If not, remove this line and the argument below it; \
$pwd = ConvertTo-SecureString -String 'theking' -Force -AsPlainText;
# Import the certificate and store it in a variable to bind to later; 
$cert = Import-PfxCertificate -Exportable -FilePath webapi.pfx -CertStoreLocation cert:\localMachine\My -Password $pwd;


#Write-Host $cert;
# Take the imported certificate and bind it to all traffic toward port 443 (you need to specify IP if you want multiple apps on 1 docker which I believe is ill-advised);

#New-WebBinding -Name "Default Web Site" -IPAddress "*" -Port 80 -protocol http -HostHeader "webapi.com" -Force
#New-WebBinding -Name "webapi" -IP "*" -Port 443 -Protocol https -HostHeader "webapi.com" -sslflags 0 -Force
#Write-Host $cert.Thumbprint[0]
#$thumbprint = $cert.Thumbprint[0]
#new-item -Path IIS:\SslBindings\0.0.0.0!443 -Thumbprint $thumbprint -SSLFlags 1
#new-item -Path IIS:\SslBindings\0.0.0.0!443 -Thumbprint $thumbprint -SSLFlags 0
#Start-Process "net stop was /y" -NoNewWindow -Wait
#Start-Process "net start w3svc" -NoNewWindow -Wait
#Start-Process "iisreset.exe" -NoNewWindow -Wait
#$certWc=Get-ChildItem -Path Cert:\LocalMachine\My | where-Object {$_.subject -like "*Internet Widgits Pty Ltd*"} | Select-Object -ExpandProperty Thumbprint
#get-item -Path "cert:\localmachine\my\$certWc" | new-item -path 'IIS:\SslBindings\0.0.0.0!443'