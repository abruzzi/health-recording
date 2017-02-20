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


# g = diaper.groupby(pd.DatetimeIndex(diaper['date']).normalize())