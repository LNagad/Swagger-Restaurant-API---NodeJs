const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const { isAuth, isAdmin } = require("../middleware/is-auth");

const dishesController = require("../controllers/dishesController");

const { notEmptyFields } = require("../helpers/routesValidationFields");

const ingredientsValidation = () => {
  return body("ingredients")
    .isArray()
    .withMessage("ingredients must be an array")
    .isLength({ min: 1 })
    .withMessage("ingredients array must contain at least one element")
    .custom((dishes) => {
      const invalidIds = dishes.filter((id) => !Number.isInteger(id));
      if (invalidIds.length) {
        throw new Error(`Invalid ingredients IDs: ${invalidIds.join(",")}`);
      }
      return true;
    });
};

/**
 * @swagger
 * /dishes:
 *   get:
 *     summary: Get all dishes
 *     description: Retrieve all dishes from the database.
 *     tags:
 *       - dishes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of dishes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Dish'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/dishes", isAuth, isAdmin, dishesController.getAll);

/**
 * @swagger
 * /dishes/{dishId}:
 *   get:
 *     summary: Get a dish by ID
 *     description: Retrieve a single dish by its ID from the database.
 *     tags:
 *       - dishes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dishId
 *         required: true
 *         description: ID of the dish to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A dish object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dish'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/dishes/:dishId", isAuth, isAdmin, dishesController.getById);

/**
 * @swagger
 * /dishes:
 *   post:
 *     summary: Crear un nuevo plato
 *     tags:
 *       - dishes
 *     description: Crea un nuevo plato con la información proporcionada
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         description: Nombre del plato
 *         in: formData
 *         required: true
 *         type: string
 *       - name: price
 *         description: Precio del plato
 *         in: formData
 *         required: true
 *         type: number
 *       - name: servings
 *         description: Número de porciones del plato
 *         in: formData
 *         required: true
 *         type: number
 *       - name: category
 *         description: Categoría del plato
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: El plato ha sido creado exitosamente
 *         schema:
 *           $ref: '#/definitions/Dish'
 *       400:
 *         description: Error en la validación de los datos enviados
 *         schema:
 *           $ref: '#/definitions/Error'
 *       500:
 *         description: Error del servidor
 *         schema:
 *           $ref: '#/definitions/Error'
 */

router.post(
  "/dishes",
  isAuth,
  isAdmin,
  notEmptyFields([
    { name: "name", label: "Name" },
    { name: "price", label: "Price", min: 3 },
    { name: "servings", label: "Number of servings", min: 1 },
    { name: "category", label: "Category" },
  ]),
  ingredientsValidation(),
  dishesController.create
);

/**
 * @swagger
 * /dishes/{dishId}:
 *   put:
 *     summary: Actualiza un plato existente
 *     tags:
 *       - dishes
 *     description: Actualiza la información de un plato existente identificado por su ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: dishId
 *         description: ID del plato a actualizar
 *         in: path
 *         required: true
 *         type: string
 *       - name: name
 *         description: Nuevo nombre del plato
 *         in: formData
 *         required: false
 *         type: string
 *       - name: price
 *         description: Nuevo precio del plato
 *         in: formData
 *         required: false
 *         type: number
 *       - name: servings
 *         description: Nuevo número de porciones del plato
 *         in: formData
 *         required: false
 *         type: number
 *       - name: category
 *         description: Nueva categoría del plato
 *         in: formData
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: El plato ha sido actualizado exitosamente
 *         schema:
 *           $ref: '#/definitions/Dish'
 *       400:
 *         description: Error en la validación de los datos enviados
 *         schema:
 *           $ref: '#/definitions/Error'
 *       404:
 *         description: El plato con el ID proporcionado no existe
 *         schema:
 *           $ref: '#/definitions/Error'
 *       500:
 *         description: Error del servidor
 *         schema:
 *           $ref: '#/definitions/Error'
 */
router.put(
  "/dishes/:dishId",
  isAuth,
  isAdmin,
  notEmptyFields([
    { name: "name", label: "Name" },
    { name: "price", label: "Price", min: 3 },
    { name: "servings", label: "Number of servings", min: 1 },
    { name: "category", label: "Category" },
  ]),
  ingredientsValidation(),
  dishesController.update
);

/**
 * @swagger
 * /dishes/{dishId}/partial:
 *   patch:
 *     tags:
 *     - dishes
 *     summary: Actualiza parcialmente un plato específico.
 *     description: Actualiza parcialmente un plato (dish) específico identificado por `dishId`.
 *     parameters:
 *       - in: path
 *         name: dishId
 *         schema:
 *           type: string
 *         required: true
 *         description: El ID del plato que se va a actualizar.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Campos del plato que se van a actualizar.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               servings:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Información actualizada del plato.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID del plato actualizado.
 *                 name:
 *                   type: string
 *                   description: Nombre del plato actualizado.
 *                 price:
 *                   type: number
 *                   description: Precio del plato actualizado.
 *                 servings:
 *                   type: number
 *                   description: Número de porciones del plato actualizado.
 *                 category:
 *                   type: string
 *                   description: Categoría del plato actualizado.
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Fecha de creación del plato actualizado.
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Fecha de actualización del plato actualizado.
 *       400:
 *         description: Algunos de los campos enviados para actualizar el plato son inválidos o no existen.
 *       401:
 *         description: No se proporcionó un token de autenticación o el token es inválido.
 *       403:
 *         description: El usuario no tiene permiso para realizar esta acción.
 *       404:
 *         description: No se encontró el plato especificado.
 *       500:
 *         description: Ocurrió un error al intentar actualizar el plato.
 */
router.patch(
  "/dishes/:dishId/partial",
  isAuth,
  isAdmin,
  dishesController.partialUpdate
);

module.exports = router;
