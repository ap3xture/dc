import binhex
import json
import pycurl
from io import BytesIO 
import time
import random
import hashlib
import hmac
import codecs

DCVersion = "9805009546"#Client Version
ID = "3423675007510305942"#User
Code = "f9c612753c99762d149791aca31ff623"#Code
SecurityToken = "41776433202696716851634839916005"#Security Token

def Curl(URL,Data,Method,Header):
    x = pycurl.Curl()
    x.setopt(pycurl.URL,URL)
    x.setopt(pycurl.PROXY,"p.webshare.io:80")
    x.setopt(pycurl.PROXYUSERPWD,"ylalucbc-rotate:ee3f8926kyyr")
    x.setopt(pycurl.ENCODING,"gzip")
    x.setopt(pycurl.MAXREDIRS,0)
    x.setopt(pycurl.TIMEOUT,120)
    x.setopt(pycurl.CONNECTTIMEOUT,2)
    x.setopt(pycurl.CONNECTTIMEOUT,0)
    x.setopt(pycurl.SSL_VERIFYHOST,0)
    x.setopt(pycurl.SSL_VERIFYPEER,0)
    x.setopt(pycurl.FOLLOWLOCATION,1)
    x.setopt(pycurl.HTTP_VERSION,pycurl.CURL_HTTP_VERSION_1_1)
    x.setopt(pycurl.CUSTOMREQUEST,Method)
    x.setopt(pycurl.POSTFIELDS,Data)
    x.setopt(pycurl.HTTPHEADER,Header)
    Buffer = BytesIO()
    x.setopt(pycurl.WRITEDATA,Buffer)
    x.perform()
    x.close()
    Response = Buffer.getvalue()
    return Response.decode('iso-8859-1')

def Login():
    Data = "security_token=%s&client_version=%s&platform=windows&client_language=en&user_id=%s&time=%s&bd_payload=%s&bd_ers=%s&shortClientVersion=22.10.5"%(SecurityToken,DCVersion,ID,time.time(),random.randint(10000, 1000000000),random.randint(10000, 1000000000))
    Sign = hmac.new(codecs.encode('ztsrubrqdz2perfq87hp'),codecs.encode(Data),hashlib.sha256).hexdigest()
    x = Curl("https://dcw-p.socialpointgames.com/ilovedragons/user/1/1/login",Data,"POST",["Content-Type: application/x-www-form-urlencoded","x-sp-sign: %s"%(Sign)])
    File = open("info.txt","w")
    File.write(x)
    File.close()

def Setup():
    Info = open("info.txt","r",encoding="utf-8")
    Data = json.load(Info)
    print(Data)

Login()