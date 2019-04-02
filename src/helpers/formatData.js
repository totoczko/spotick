export const formatData = (data) => {
  let now = new Date();
  let formatted = new Date(data);
  let dd = formatted.getDate();
  let mm = formatted.getMonth() + 1;
  if (dd < 10) {
    dd = '0' + dd
  };
  let diff = (now.getTime() - formatted.getTime()) / 1000;
  const diff_min = Math.abs(Math.round(diff / 60));
  const pl = (num) => {
    if (num === 1) {
      return 'ę';
    } else if (num > 1 && num < 5) {
      return 'y';
    }
    return '';
  }
  let result = diff_min + ' minut' + pl(diff_min) + ' temu';
  if (diff_min >= 60 && diff_min < (60 * 24)) {
    const diff_hour = Math.abs(Math.round(diff / (60 * 60)));
    result = diff_hour + ' godzin' + pl(diff_hour) + ' temu'
  } else if (diff_min >= (60 * 24)) {
    const month = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia']
    result = dd + ' ' + month[mm - 1]
  }
  return result
}