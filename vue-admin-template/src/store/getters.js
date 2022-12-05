const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  visitedViews: state => state.tagsView.visitedViews,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes
}
export default getters
