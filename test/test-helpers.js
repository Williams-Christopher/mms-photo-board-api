const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function truncateTables(db) {
    return db.raw(
        `TRUNCATE TABLE
            media_likes,
            media,
            users
            RESTART IDENTITY CASCADE;`
    );
};

function seedUsersTable(db) {
    const hashedUsers = createUsersArray().map(user => ({
        ...user,
        user_password: bcrypt.hashSync(user.user_password, 1),
        user_phone: bcrypt.hashSync(user.user_phone, 1)
    })
    );

    return db('users')
        .insert(hashedUsers);
};

function seedMediaTable(db) {
    const testMedia = createMediaArray();
    return db('media')
        .insert(testMedia);
};

function seedMediaLikesTable(db) {
    const testMediaLikes = createMediaLikesArray();
    return db('media_likes')
        .insert(testMediaLikes)
};

async function seedAllTables(db) {
    await seedUsersTable(db);
    await seedMediaTable(db);
    await seedMediaLikesTable(db);
};

function makeDateInPast(daysInPast = 0) {
    let date = new Date();
    if (daysInPast > 0) {
        date.setDate(date.getDate() - daysInPast)
        return date.toISOString();
    }
    return date;
};

function createUsersArray() {
    return [
        {
            user_first_name: 'Malcolm',
            user_last_name: 'Reynolds',
            user_name: 'mal',
            user_password: 'Browncoats!1',
            user_phone: '+11234567890',
            verified: 'true'
        },
        {
            user_first_name: 'Hoban',
            user_last_name: 'Washburne',
            user_name: 'wash',
            user_password: '#Pilot007',
            user_phone: '+12345678901',
            verified: 'false'
        },
        {
            user_first_name: 'Kaylee',
            user_last_name: 'Fry',
            user_name: 'kbug',
            user_password: '1Shiny!',
            user_phone: '+13456789012',
            verified: 'false'
        },
        {
            user_first_name: 'Jayne',
            user_last_name: 'Cobb',
            user_name: 'hero',
            user_password: 'OfCanton!',
            user_phone: '+14567890123',
            verified: 'false'
        },
        {
            user_first_name: 'River',
            user_last_name: 'Tamm',
            user_name: 'rtamm',
            user_password: 'Vo1c35',
            user_phone: '+15678901234',
            verified: 'true'
        }
    ];
};

function createMediaArray() {
    return [
        {
            user_id: 1,
            media_url: 'https://picsum.photos/1027/768',
            media_caption: '#Payday',
            media_location: 'Serenity',
            created: makeDateInPast(0),
        },
        {
            user_id: 2,
            media_url: 'https://picsum.photos/1027/768',
            media_caption: 'Piloting is the best waya to see the verse',
            media_location: 'Serenity',
            created: makeDateInPast(1)
        },
        {
            user_id: 3,
            media_url: 'https://picsum.photos/4032/3024',
            media_caption: 'Shiny!',
            media_location: 'Canton',
            created: makeDateInPast(1),
        },
        {
            user_id: 4,
            media_url: 'https://picsum.photos/4032/3024',
            media_caption: 'The Reverend says my soul is safe',
            media_location: 'Taylor',
            created: makeDateInPast(2)
        },
        {
            user_id: 5,
            media_url: 'https://picsum.photos/3264/2448',
            media_caption: 'Reaver free since 93',
            media_location: 'The Verse',
            created: makeDateInPast(2)
        },
        {
            user_id: 4,
            media_url: 'https://picsum.photos/1027/768',
            media_caption: 'The cargo bay is my home',
            media_location: 'Serenity',
            created: makeDateInPast(3)
        },
        {
            user_id: 3,
            media_url: 'https://picsum.photos/2048/1024',
            media_caption: 'I dont know whats happening',
            media_location: 'Serenity',
            created: makeDateInPast(3)
        },
        {
            user_id: 4,
            media_url: 'https://loremflickr.com/750/300/landscape?random=10',
            media_caption: 'So cool! I just got a dog!',
            media_location: 'Somewhere',
            created: makeDateInPast(4)
        }
    ];
};

function createMediaLikesArray() {
    return [
        {
            user_id: 1,
            media_id: 1
        },
        {
            user_id: 2,
            media_id: 4
        },
        {
            user_id: 3,
            media_id: 2
        },
        {
            user_id: 4,
            media_id: 6
        },
        {
            user_id: 5,
            media_id: 5
        },
        {
            user_id: 2,
            media_id: 6
        },
        {
            user_id: 5,
            media_id: 4
        },
        {
            user_id: 3,
            media_id: 5
        },
        {
            user_id: 5,
            media_id: 6
        },
        {
            user_id: 4,
            media_id: 5
        },
        {
            user_id: 4,
            media_id: 1
        },
        {
            user_id: 1,
            media_id: 6
        },
        {
            user_id: 2,
            media_id: 3
        },
        {
            user_id: 2,
            media_id: 1
        },
        {
            user_id: 5,
            media_id: 1
        },
        {
            user_id: 5,
            media_id: 2
        }
    ];
};

function createBearerToken(user = {}, secret = process.env.JWT_SECRET) {
    const token = jwt.sign(
        { user_id: user.id },
        secret,
        { subject: user.user_name, algorithm: 'HS256'}
    );

    return `Bearer ${ token }`;
};

module.exports = {
    createUsersArray,
    createMediaArray,
    createMediaLikesArray,
    truncateTables,
    seedUsersTable,
    seedMediaTable,
    seedMediaLikesTable,
    seedAllTables,
    makeDateInPast,
    createBearerToken,
};
