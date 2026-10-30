import pathlib
r=pathlib.Path(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)),'src'))
s=(r/'shell.html').read_text()
for k,f in [('CSS','style.css'),('KB','kb.js'),('JM','j-money.js'),('JF','j-family.js'),('JC','j-consumer.js'),('JO','j-other.js'),('JN','j-nri.js'),('JB','j-business.js'),('QA','qa.js'),('ENGINE','engine.js'),('APP','app.js')]:
    s=s.replace('/*%s*/'%k,(r/f).read_text().replace('</script','<\\/script'),1)
pathlib.Path(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)),'build','index.html')).write_text(s)
print(len(s))
