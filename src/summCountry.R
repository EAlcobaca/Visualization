
df = read.csv("data/data2.csv");

newdf = data.frame(sort(table(df$Country), decreasing=TRUE));
colnames(newdf) <- c('Country', 'Frequency');

write.table(newdf, "data/dataSumm.csv", sep=',', row.names=FALSE);
