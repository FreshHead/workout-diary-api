# workout-diary-api

Эксперементирую с LoopBack 4.
Делаю дневник тренировок.

# workout-diary-api

REST API для дневника тренировок. Пользователь может создавать тренировки и добавлять к ним упражнения.

## Стек

- **Фреймворк:** LoopBack4
- **База данных:** MongoDB
- **Язык:** TypeScript

---

## Модели

**Workout**
| Поле | Тип | Обязательное |
|------|-----|--------------|
| id | string (ObjectId) | авто |
| date | date | да |
| notes | string | нет |

**Exercise**
| Поле | Тип | Обязательное |
|------|-----|--------------|
| id | string (ObjectId) | авто |
| name | string | да |
| sets | number | да |
| reps | number | да |
| weight | number | нет |
| workoutId | string | авто |

**Связь:** `Workout hasMany Exercise`

---

## Эндпоинты

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/workouts` | Список всех тренировок |
| POST | `/workouts` | Создать тренировку |
| GET | `/workouts/{id}` | Получить тренировку |
| PATCH | `/workouts/{id}` | Обновить тренировку |
| DELETE | `/workouts/{id}` | Удалить тренировку |
| GET | `/workouts/{id}/exercises` | Упражнения тренировки |
| POST | `/workouts/{id}/exercises` | Добавить упражнение |
| DELETE | `/workouts/{id}/exercises/{exerciseId}` | Удалить упражнение |


## Запуск проекта:
```
npm start
```
