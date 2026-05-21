export interface Round {
  id: number;
  sender: string;
  subject: string;
  body: string;
  isPhishing: boolean;
  hint: string;
}

export const PHISHING_DATA: Round[] = [
  {
    id: 1,
    sender: 'security@bank-ru.ru',
    subject: 'Срочно: подтвердите данные карты',
    body: 'Ваша карта заблокирована. Перейдите по ссылке для разблокировки: http://bit.ly/bank-secure-login',
    isPhishing: true,
    hint: 'Ссылка на подозрительный домен (bit.ly). Банк никогда не просит переходить по коротким ссылкам.',
  },
  {
    id: 2,
    sender: 'noreply@amazon.com',
    subject: 'Ваш заказ #112-998-333 отправлен',
    body: 'Ваш заказ отправлен по адресу, указанному в профиле. Ожидайте доставку.',
    isPhishing: false,
    hint: 'Официальный адрес Amazon и реалистичные данные о заказе.',
  },
  {
    id: 3,
    sender: 'telegram.support@tg-web-notify.ru',
    subject: 'Подтверждение входа в Telegram',
    body: 'Для входа в Telegram Web подтвердите свой аккаунт: откройте ссылку и введите код из SMS.',
    isPhishing: true,
    hint: 'Telegram never sends emails to confirm login. Unknown domain tg-web-notify.ru.',
  },
  {
    id: 4,
    sender: 'billing@netflix.com',
    subject: 'Обновление способа оплаты для аккаунта',
    body: 'Произошла ошибка при оплате подписки. Обновите данные карты в настройках аккаунта на нашем сайте.',
    isPhishing: false,
    hint: 'Официальный электронный адрес Netflix и обычное письмо об обновлении оплаты.',
  },
  {
    id: 5,
    sender: 'hr@example-corp.ru',
    subject: 'Запрошенное подтверждение договора',
    body: 'Здравствуйте, отправляем подтверждение вложенного к документу. Ошибочное письмо — проигнорируйте.',
    isPhishing: false,
    hint: 'Реалистичные HR-коммуникации, нет подозрительных ссылок.',
  },
  {
    id: 6,
    sender: 'prize@win-now2024.ru',
    subject: 'Вы выиграли 100 000 ₽!',
    body: 'Поздравляем! Для получения приза подтвердите свои данные и заплатите сбор 500 ₽ вот тут.',
    isPhishing: true,
    hint: 'Оба giveaway scam и просьба оплатить "сбор" — классический фишинг.',
  },
  {
    id: 7,
    sender: 'security-team@vk.com',
    subject: 'Ваш аккаунт под угрозой взлома',
    body: 'Мы заметили подозрительную активность. Примите меры прямо сейчас, сбросив пароль.',
    isPhishing: false,
    hint: 'Официальный домен VK и письмо о безопасности без подозрительных ссылок.',
  },
  {
    id: 8,
    sender: 'cloud.drop-box.ru',
    subject: 'Кто-то поделился файлами с вами',
    body: 'Перейдите по ссылке, чтобы просмотреть совместные файлы: https://cloud.drop-box.ru/share/abc123',
    isPhishing: true,
    hint: 'drop-box.ru — не официальный домен Dropbox (dropbox.com). Фальшивый поддельный сайт.',
  },
  {
    id: 9,
    sender: 'info@spotify.com',
    subject: 'Слушайте новый плейлист, созданный для вас',
    body: 'На основе ваших предпочтений мы составили персональный плейлист недели.',
    isPhishing: false,
    hint: 'Официальный email Spotify и типичная рассылка без ссылок для входа.',
  },
  {
    id: 10,
    sender: 'police@cybercontrol.gov.ru',
    subject: 'Urgent: уголовное дело',
    body: 'В ваш адрес поступила жалоба. Для отмены перейдите по ссылке и введите данные банковской карты для погрешности.',
    isPhishing: true,
    hint: 'Полица или суды никогда не просят данные карты по email или ссылке.',
  },
];

export function shuffleRounds(rounds: Round[], seed = 42): Round[] {
  const arr = [...rounds];
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
