import openpyxl as px
import numpy as np
import pandas as pd

#reading dataset
print(">> Reading dataset <<\n\n")
dataset = pd.read_csv("data/Times World University Rankings (2016).csv")

#convert rank to numbers
#ranks will receive (value1 + value2) / 2 instead of category value1-value2
print(">> Convert all column to numeric <<\n\n")
copy = dataset.World_Rank.values
for i in range(200,dataset.shape[0]):
  split =   str(copy[i]).split('-')
  copy[i] = (float(split[0]) + float(split[1]))/2

dataset['World_Rank'] = copy

#convert categories to numbers
dataset.Country = pd.Categorical(dataset.Country)
dataset['Country'] = dataset.Country.cat.codes

print(">> Missing values inputation <<\n\n")
#print missing values per column
print('Missing values per column :\n', dataset.isnull().sum(),'\n')

#fill missing values with mean column values
dataset.fillna(dataset.mean(), inplace=True)
dataset.apply(pd.to_numeric)

#print missing values per column
print('Missing values per column :\n', dataset.isnull().sum(),'\n')


#save dataframe
dataset = dataset.iloc[1:200,]
del dataset['University_Name']
del dataset['Country']
print(dataset.shape)
print(">> Saving pre-processed dataset <<\n\n")
dataset.to_csv("data/data.csv", index=False)
print(">> End of script <<\n\n")


