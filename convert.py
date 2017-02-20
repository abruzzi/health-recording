import numpy as np
import pandas as pd

diaper = pd.read_csv('data/diaper_data.csv', usecols=['date', 'status'])
diaper['date'] = pd.to_datetime(diaper['date'], format='%Y/%m/%d %H:%M')
diaper.index=diaper['date']

def mapper(key):
    if key == '嘘嘘':
        return pd.Series([1, 0], index=['urinate', 'stool'])
    elif key == '便便':
        return pd.Series([0, 1], index=['urinate', 'stool'])
    else:
        return pd.Series([1, 1], index=['urinate', 'stool'])
    

converted = diaper['status'].apply(mapper)
diaper = pd.concat([diaper, converted], axis=1)


grouped = diaper.groupby(pd.TimeGrouper('D'))

result = grouped.aggregate(np.sum)
result.to_csv('data/diaper_normolized.csv')


# g = diaper.groupby(pd.DatetimeIndex(diaper['date']).normalize())

sleeping = pd.read_csv('data/sleeping_data.csv', usecols=['date', 'length'])
sleeping['date'] = pd.to_datetime(sleeping['date'], format="%Y/%m/%d %H:%M")
sleeping.index = sleeping['date']

grouped = sleeping.groupby(pd.TimeGrouper('D'))
result = grouped.aggregate(np.sum)

result.to_csv('data/sleeping_normolized.csv')

nursing = pd.read_csv('data/nursing_data.csv', usecols=['date', 'left', 'right'])
nursing['date'] = pd.to_datetime(nursing['date'], format='%Y/%m/%d %H:%M')
nursing.index = nursing['date']

nursing['total'] = nursing['left'] + nursing['right']
grouped = nursing.groupby(pd.TimeGrouper('H'))

for name, group in grouped:
	print(name)


print(grouped.aggregate(np.sum).fillna(0))

result = grouped.aggregate(np.sum).fillna(0)
result.to_csv('data/nursing_normolized_hours.csv')