@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -Command "$s=(New-Object -ComObject WScript.Shell).CreateShortcut('%~dp0PTF Studio.lnk');$s.TargetPath='%~dp0PTF Studio.bat';$s.WorkingDirectory='%~dp0';$s.IconLocation='%~dp0PTFStudio.ico,0';$s.Description='PTF Studio 1.0';$s.Save()"
if exist "%~dp0PTF Studio.lnk" (
  echo Created PTF Studio.lnk with the custom app icon.
) else (
  echo Could not create the shortcut.
)
pause
