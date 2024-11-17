import requireScope from 'auth/requireScope';
import { SCOPES } from 'auth/scopes';
import bodyParser from 'body-parser';
import { noteController } from 'controllers';
import { errorHandler } from 'errors';
import express from 'express';
import { createValidator } from 'express-joi-validation';
import { validationErrorHandler } from 'validation';
import {
  CreateNoteSchema,
  UpdateNoteSchema,
} from 'validation/note';

const router = express();
const validator = createValidator({ passError: true });

// TODO Move middleware attachment to test file
if (process.env.NODE_ENV === 'test') {
  // enable json message body for posting data to router
  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(bodyParser.json());
}

// NOTE This route is not needed for the current implementation
// find and return all resources
// router.route('/')
//   // TODO when a user creates a note, the note should be associated with the user
//   .post(
//     requireScope(SCOPES.USER.name),
//     validator.body(CreateNoteSchema),
//     noteController.createNote,
//   )
//   // TODO only return notes that are associated with the user
//   .get(
//     // NOTE right now, we have no authentication, so keep this line commented out
//     // requireScope(SCOPES.USER.name),
//     noteController.getNotes,
//   );

router.route('/:id')
  // TODO only return notes that are associated with the user
  .get(
    // NOTE right now, we have no authentication, so keep this line commented out
    // requireScope(SCOPES.USER.name),
    noteController.getNote,
  )
  // TODO only allow the user to update notes that are associated with the user
  .patch(
    requireScope(SCOPES.USER.name),
    validator.body(UpdateNoteSchema),
    noteController.updateNote,
  )
  // TODO only allow the user to delete notes that are associated with the user
  .delete(
    requireScope(SCOPES.USER.name),
    noteController.deleteNote,
  );

// NOTE this route helps return notes that are associated with the user by student UUID i.e. f0056b1
router.route('/student/:studentUUID')
  // create a note associated with a student
  .post(
    // NOTE right now, we have no authentication, so keep this line commented out
    // requireScope(SCOPES.USER.name),
    validator.body(CreateNoteSchema),
    noteController.createNote,
  )
  .get(
    // NOTE right now, we have no authentication, so keep this line commented out
    // requireScope(SCOPES.USER.name),
    noteController.getNotesByStudentUUID,
  )
  // TODO only allow a student's dean to update notes that are associated with student
  .patch(
    requireScope(SCOPES.USER.name),
    validator.body(UpdateNoteSchema),
    noteController.updateNote,
  )
  // TODO only allow a student's dean to delete notes that are associated with student
  .delete(
    requireScope(SCOPES.USER.name),
    noteController.deleteNote,
  );

if (process.env.NODE_ENV === 'test') {
  router.use(validationErrorHandler);
  router.use(errorHandler);
}


export default router;
