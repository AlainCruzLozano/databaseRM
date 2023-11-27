const usersModel ={
    getAll:`
    SELECT
        *
    FROM
        rick_and_morty_data
    `,

    getByID:`
    SELECT
        *
    FROM
        rick_and_morty_data
    WHERE
        character_id=?
    `,

    addRow:`
    INSERT INTO
        rick_and_morty_data(
            name,
            status,
            species,
            Gender
        )
    VALUES(
        ?,?,?,?
    )
    `,

    getByUsername:`
        SELECT
            *
        FROM
            rick_and_morty_data
        WHERE name = ?
    `,

    updateRow:`
    UPDATE
        rick_and_morty_data
    SET
        name = ?,
        status = ?,
        species = ?,
        Gender = ?
    WHERE
        character_id=?`,
    

    deleteRow:`
    delete
    from
        rick_and_morty_data
    WHERE
        character_id =?`

};
module.exports=usersModel;