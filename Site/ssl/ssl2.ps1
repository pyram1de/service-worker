Write-Output "do the administration stuff..."
Import-Module IISAdministration;
Import-Module WebAdministration;

$cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2("myCA.pem")
$rootStore = Get-Item cert:\LocalMachine\Root
$rootStore.Open("ReadWrite")
$rootStore.Add($cert)
$rootStore.Close()

$pwd = ConvertTo-SecureString -String 'theking' -Force -AsPlainText;
$cert = Import-PfxCertificate -Exportable -FilePath myCertificate.pfx -CertStoreLocation cert:\localMachine\My -Password $pwd;

New-WebBinding -Name "Default Web Site" -IPAddress "*" -Port 80 -protocol http -HostHeader "minisite.com" -Force
New-WebBinding -Name "Default Web Site" -IP "*" -Port 443 -Protocol https -HostHeader "minisite.com" -sslflags 0 -Force
Write-Host $cert.Thumbprint[0]
$thumbprint = $cert.Thumbprint[0]
new-item -Path IIS:\SslBindings\0.0.0.0!443 -Thumbprint $thumbprint -SSLFlags 0

