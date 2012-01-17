
for l in `ls css/*.less`; do 
  f=`basename $l .less`
  lessc $l > css/${f}.css; 
done