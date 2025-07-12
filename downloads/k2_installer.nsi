; K2 Language Windows Installer Script
; For use with NSIS (Nullsoft Scriptable Install System)

; Define constants
!define PRODUCT_NAME "K2 Programming Language"
!define PRODUCT_VERSION "2.0.0"
!define PRODUCT_PUBLISHER "K2 Language Team"
!define PRODUCT_WEB_SITE "https://k2lang.org"
!define PRODUCT_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\k2.exe"
!define PRODUCT_UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
!define PRODUCT_UNINST_ROOT_KEY "HKLM"

; Include modern UI
!include "MUI2.nsh"

; MUI Settings
!define MUI_ABORTWARNING

; Welcome page
!insertmacro MUI_PAGE_WELCOME

; License page
!insertmacro MUI_PAGE_LICENSE "license.txt"

; Directory page
!insertmacro MUI_PAGE_DIRECTORY

; Components page
!insertmacro MUI_PAGE_COMPONENTS

; Instfiles page
!insertmacro MUI_PAGE_INSTFILES

; Finish page
!define MUI_FINISHPAGE_RUN "$INSTDIR\k2.exe"
!define MUI_FINISHPAGE_SHOWREADME "$INSTDIR\readme.txt"
!insertmacro MUI_PAGE_FINISH

; Uninstaller pages
!insertmacro MUI_UNPAGE_WELCOME
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

; Language files
!insertmacro MUI_LANGUAGE "English"

; Reserve files
!insertmacro MUI_RESERVEFILE_INSTALLOPTIONS

; Installer attributes
Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "K2_Language_Setup_${PRODUCT_VERSION}.exe"
InstallDir "$PROGRAMFILES\K2 Language"
InstallDirRegKey HKLM "${PRODUCT_DIR_REGKEY}" ""
ShowInstDetails show
ShowUnInstDetails show

; Installer sections
Section "K2 Core" SecCore
  SectionIn RO
  SetOutPath "$INSTDIR"
  SetOverwrite ifnewer
  
  ; Main executable and libraries
  File "..\bin\k2.exe"
  File "..\bin\k2_turbo.exe"
  File "..\bin\readme.md"
  File "..\license.txt"
  
  ; Create readme.txt
  FileOpen $0 "$INSTDIR\readme.txt" w
  FileWrite $0 "K2 Programming Language v${PRODUCT_VERSION}$\r$\n"
  FileWrite $0 "==============================$\r$\n$\r$\n"
  FileWrite $0 "Thank you for installing K2 Language!$\r$\n$\r$\n"
  FileWrite $0 "To get started, open a command prompt and type:$\r$\n"
  FileWrite $0 "k2 --help$\r$\n$\r$\n"
  FileWrite $0 "For more information, visit:$\r$\n"
  FileWrite $0 "${PRODUCT_WEB_SITE}$\r$\n"
  FileClose $0
  
  ; Create directories
  CreateDirectory "$INSTDIR\lib"
  CreateDirectory "$INSTDIR\examples"
  CreateDirectory "$INSTDIR\docs"
  
  ; Add to PATH
  EnVar::SetHKLM
  EnVar::AddValue "PATH" "$INSTDIR"
  
  ; Create registry entries
  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "" "$INSTDIR\k2.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayName" "$(^Name)"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString" "$INSTDIR\uninst.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayIcon" "$INSTDIR\k2.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "URLInfoAbout" "${PRODUCT_WEB_SITE}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "Publisher" "${PRODUCT_PUBLISHER}"
  
  ; Create uninstaller
  WriteUninstaller "$INSTDIR\uninst.exe"
SectionEnd

Section "K2 GUI Library" SecGUI
  SetOutPath "$INSTDIR"
  File "..\bin\k2gui.dll"
  File "..\bin\k2gui_helper.dll"
  
  ; Copy GUI library files
  SetOutPath "$INSTDIR\lib"
  File "..\lib\k2gui.k2"
  File "..\lib\k2gui_simple.k2"
  
  ; Copy GUI examples
  SetOutPath "$INSTDIR\examples\gui"
  File "..\examples\gui\*.k2"
SectionEnd

Section "K2 Examples" SecExamples
  SetOutPath "$INSTDIR\examples"
  File "..\examples\*.k2"
  
  ; Create Start Menu shortcuts for examples
  CreateDirectory "$SMPROGRAMS\K2 Language\Examples"
  CreateShortCut "$SMPROGRAMS\K2 Language\Examples\Hello World.lnk" "$INSTDIR\k2.exe" "$INSTDIR\examples\hello_world.k2"
  CreateShortCut "$SMPROGRAMS\K2 Language\Examples\Calculator.lnk" "$INSTDIR\k2.exe" "$INSTDIR\examples\calculator.k2"
SectionEnd

Section "Documentation" SecDocs
  SetOutPath "$INSTDIR\docs"
  File "..\docs\*.md"
  File "..\docs\*.html"
  
  ; Create Start Menu shortcut for documentation
  CreateDirectory "$SMPROGRAMS\K2 Language"
  CreateShortCut "$SMPROGRAMS\K2 Language\Documentation.lnk" "$INSTDIR\docs\index.html"
  CreateShortCut "$SMPROGRAMS\K2 Language\K2 Website.lnk" "${PRODUCT_WEB_SITE}"
SectionEnd

Section "Start Menu Shortcuts" SecShortcuts
  CreateDirectory "$SMPROGRAMS\K2 Language"
  CreateShortCut "$SMPROGRAMS\K2 Language\K2 Command Prompt.lnk" "%comspec%" '/k "cd /d $INSTDIR"'
  CreateShortCut "$SMPROGRAMS\K2 Language\Uninstall.lnk" "$INSTDIR\uninst.exe"
SectionEnd

; Section descriptions
!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  !insertmacro MUI_DESCRIPTION_TEXT ${SecCore} "Core K2 language files (required)"
  !insertmacro MUI_DESCRIPTION_TEXT ${SecGUI} "K2 GUI library for creating graphical applications"
  !insertmacro MUI_DESCRIPTION_TEXT ${SecExamples} "Example K2 programs"
  !insertmacro MUI_DESCRIPTION_TEXT ${SecDocs} "K2 language documentation"
  !insertmacro MUI_DESCRIPTION_TEXT ${SecShortcuts} "Start menu shortcuts"
!insertmacro MUI_FUNCTION_DESCRIPTION_END

; Uninstaller section
Section Uninstall
  ; Remove registry entries
  DeleteRegKey ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}"
  DeleteRegKey HKLM "${PRODUCT_DIR_REGKEY}"
  
  ; Remove from PATH
  EnVar::SetHKLM
  EnVar::DeleteValue "PATH" "$INSTDIR"
  
  ; Remove files and directories
  Delete "$INSTDIR\k2.exe"
  Delete "$INSTDIR\k2_turbo.exe"
  Delete "$INSTDIR\k2gui.dll"
  Delete "$INSTDIR\k2gui_helper.dll"
  Delete "$INSTDIR\readme.txt"
  Delete "$INSTDIR\readme.md"
  Delete "$INSTDIR\license.txt"
  Delete "$INSTDIR\uninst.exe"
  
  RMDir /r "$INSTDIR\lib"
  RMDir /r "$INSTDIR\examples"
  RMDir /r "$INSTDIR\docs"
  RMDir "$INSTDIR"
  
  ; Remove Start Menu shortcuts
  RMDir /r "$SMPROGRAMS\K2 Language"
  
  SetAutoClose true
SectionEnd