import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#777',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#e8f0fe',
    borderRadius: 30,
    padding: 4,
    marginTop: 48,
    height: 56,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    height: '100%',
  },
  activeTab: {
    backgroundColor: '#fff',
    elevation: 2,
  },
  tabText: {
    color: '#888',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    color: '#000',
    marginBottom: 16,
    marginTop: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 50,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  verifyTextInline: {
    color: '#0a7cf3',
    fontWeight: '600',
    marginLeft: 12,
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    fontSize: 12,
  },
  otpButton: {
    marginTop: 43,
    backgroundColor: '#0a7cf3',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  otpButtonDisabled: {
    backgroundColor: '#a0cfff',
  },
  otpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 61,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: 'black',
    fontSize: 12,
  },
  googleButton: {
    backgroundColor: '#e8f0fe',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 46,
  },
  googleText: {
    fontWeight: '600',
    fontSize: 16,
  },
  registerText: {
    textAlign: 'center',
    color: '#444',
  },
  createAccount: {
    color: '#f77',
    fontWeight: '600',
  },
});
