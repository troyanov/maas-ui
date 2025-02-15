/* Copyright 2015-2016 Canonical Ltd.  This software is licensed under the
 * GNU Affero General Public License version 3 (see the file LICENSE).
 *
 * MAAS User Manager
 *
 * Manages all of the users in the browser. The manager uses the
 * RegionConnection to load the users, update the users, and listen for
 * notification events about users.
 */
import angular from "angular";

function UsersManager(Manager, RegionConnection, ErrorService) {
  function UsersManager() {
    Manager.call(this);

    this._pk = "id";
    this._handler = "user";

    // Loading users is very small in data, set the batch size higher so
    // the UI loads faster when lots of users exist.
    this._batchSize = 200;

    // Holds the authenticated user for the connection.
    this._authUser = null;

    // Listen for notify events for the user object.
    var self = this;
    RegionConnection.registerNotifier("user", function (action, data) {
      self.onNotify(action, data);
    });
  }

  UsersManager.prototype = new Manager();

  // Get the authenticated user for the connection.
  UsersManager.prototype.getAuthUser = function () {
    return this._authUser;
  };

  // Return true if the authenticated user is super user.
  UsersManager.prototype.isSuperUser = function () {
    var authUser = this.getAuthUser();
    if (!angular.isObject(authUser)) {
      return false;
    }
    return authUser.is_superuser;
  };

  // Load the authenticated user.
  UsersManager.prototype._loadAuthUser = function () {
    var self = this;
    return RegionConnection.callMethod("user.auth_user", {}).then(
      function (user) {
        if (angular.isObject(self._authUser)) {
          // Copy the user into the authUser. This keeps the
          // reference the same, not requiring another call to
          // getAuthUser.
          angular.copy(user, self._authUser);
        } else {
          self._authUser = user;
        }
        return self._authUser;
      },
      function (error) {
        ErrorService.raiseError(error);
      }
    );
  };

  UsersManager.prototype._replaceItem = function (item) {
    Manager.prototype._replaceItem.call(this, item);

    // Update the authenticated user if updated item has the
    // same primary key.
    if (
      angular.isObject(this._authUser) &&
      this._authUser[this._pk] === item[this._pk]
    ) {
      // Copy the item into the authUser. This keeps the reference
      // the same, not requiring another call to getAuthUser.
      angular.copy(item, this._authUser);
    }
  };

  UsersManager.prototype.loadItems = async function () {
    // Load the auth user when all the items are loaded as well.
    await this._loadAuthUser();
    return Manager.prototype.loadItems.call(this);
  };

  UsersManager.prototype.reloadItems = async function () {
    // Load the auth user when all the items are reloaded as well.
    await this._loadAuthUser();
    return Manager.prototype.reloadItems.call(this);
  };

  return new UsersManager();
}

UsersManager.$inject = ["Manager", "RegionConnection", "ErrorService"];

export default UsersManager;
