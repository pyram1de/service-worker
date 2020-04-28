$securePfxPass = [Environment]::GetEnvironmentVariable("CERT_PASS") | ConvertTo-SecureString -AsPlainText -Force
Import-PfxCertificate -Password $securePfxPass -CertStoreLocation Cert:\LocalMachine\My -FilePath c:\inetpub\wwwroot\myCertificate.pfx   

$pfxThumbprint = (Get-PfxData -FilePath c:\inetpub\wwwroot\myCertificate.pfx -Password $securePfxPass).EndEntityCertificates.Thumbprint

$binding = New-WebBinding -Name "Default Web Site" -Protocol https -IPAddress * -Port 443;
$binding = Get-WebBinding -Name "Default Web Site" -Protocol https;
$binding.AddSslCertificate($pfxThumbprint, "my");

#You should remove both the PFX password from the Environment Variable and the .pfx file
[Environment]::SetEnvironmentVariable("CERT_PASS",$null)