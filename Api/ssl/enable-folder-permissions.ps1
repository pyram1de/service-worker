Write-Output "do the folder permissions stuff..."

$sharepath = "C:\app"
$Acl = Get-ACL $SharePath
$AccessRule= New-Object System.Security.AccessControl.FileSystemAccessRule("everyone","FullControl","ContainerInherit,Objectinherit","none","Allow")
$Acl.AddAccessRule($AccessRule)
Set-Acl $SharePath $Acl
#Import-Module IISAdministration;
#Import-Module WebAdministration;
#
#Remove-WebSite -Name 'Default Web Site'
#New-Website -Name 'minisite' -IPAddress '*' -Port 443 -PhysicalPath C:\app -ApplicationPool '.NET v4.5' -Ssl -SslFlags 0  
#
#$pfx = new-object System.Security.Cryptography.X509Certificates.X509Certificate2 
#$certPath = "C:\app\myCertificate.pfx"
#$pfxPass = ConvertTo-SecureString -String 'theking' -Force -AsPlainText;
#$pfx.import($certPath,$pfxPass,"Exportable,PersistKeySet,MachineKeySet") 
#$store = new-object System.Security.Cryptography.X509Certificates.X509Store("My", "LocalMachine")
#$store.open("MaxAllowed") 
#$store.add($pfx) 
#$store.close()
#
#Set-ExecutionPolicy Unrestricted
#Import-Module WebAdministration
#New-WebBinding -Name "minisite" -IP "*" -Port 443 -Protocol https -HostHeader "minisite.com"
#
#$certWc=Get-ChildItem -Path Cert:\LocalMachine\My | where-Object {$_.subject -like "*minisite.com*"} | Select-Object -ExpandProperty Thumbprint
#get-item -Path "cert:\localmachine\my\$certWc" | new-item -path 'IIS:\SslBindings\0.0.0.0!443'