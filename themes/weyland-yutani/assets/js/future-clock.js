export function displayFutureDateTime() {
  const clockElement = document.getElementById('clock');
  if (!clockElement) return;

  const FUTURE_YEAR = 2239;
  const CURRENT_YEAR = new Date().getFullYear();
  const YEAR_OFFSET = FUTURE_YEAR - CURRENT_YEAR;

  const updateTime = () => {
    const now = new Date();
    const futureYear = now.getFullYear() + YEAR_OFFSET;

    const dateString = `${futureYear}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    clockElement.innerHTML = `${dateString}<br>${timeString}`;
  };

  updateTime();
  setInterval(updateTime, 1000);
}
