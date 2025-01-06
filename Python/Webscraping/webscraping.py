import requests
from bs4 import BeautifulSoup

URL = "https://economictimes.indiatimes.com/markets/expert-view/bottom-up-stock-picking-key-to-building-a-strong-portfolio-vetri-subramaniam/articleshow/75806794.cms" 
page =  requests.get(URL)

htmldata = BeautifulSoup(page.content,"html.parser")
meta_data =[i for i in htmldata.findAll("meta") if 'property="og:' in str(i)]

final_data = {}

for i in meta_data:
    if 'property="og:title"' in str(i):
        final_data['title'] = i.attrs['content']
    elif  'property="og:url"' in str(i):
        final_data['url'] = i.attrs['content']
    elif 'property="og:image"' in str(i):
        final_data['image'] = i.attrs['content']
    elif 'property="og:description"' in str(i):
        final_data['description'] = i.attrs['content']
    
print(final_data)

# ==================================================================================================================
"""
<meta content="Bottom-up stock picking key to building a strong portfolio: Vetri Subramaniam" property="og:title"/>
<meta content="The Economic Times" property="og:site_name"/>
<meta content="article" property="og:type"/>
<meta content="https://economictimes.indiatimes.com/markets/expert-view/bottom-up-stock-picking-key-to-building-a-strong-portfolio-vetri-subramaniam/articleshow/75806794.cms" property="og:url"/>
<meta content="https://img.etimg.com/thumb/msid-75806786,width-1070,height-580,imgsize-214210,overlay-etmarkets/photo.jpg" property="og:image"/>
<meta content="‘Govt needs to intervene more critically in the area of credit guarantees" property="og:description"/>

"""