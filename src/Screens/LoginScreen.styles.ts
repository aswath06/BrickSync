import { StyleSheet } from 'react-native';
import { moderateScale } from './utils/scalingUtils';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(24),
    backgroundColor: '#fff',
    paddingTop: moderateScale(60),
  },
  title: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    marginTop: moderateScale(4),
    fontSize: moderateScale(14),
    color: '#777',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#e8f0fe',
    borderRadius: moderateScale(30),
    padding: moderateScale(4),
    marginTop: moderateScale(48),
    height: moderateScale(56),
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(30),
    height: '100%',
  },
  activeTab: {
    backgroundColor: '#fff',
    elevation: moderateScale(2),
  },
  tabText: {
    color: '#888',
    fontWeight: '500',
    fontSize: moderateScale(14),
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
    fontSize: moderateScale(14),
  },
  label: {
    fontSize: moderateScale(14),
    color: '#000',
    marginBottom: moderateScale(16),
    marginTop: moderateScale(24),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(30),
    paddingHorizontal: moderateScale(16),
    height: moderateScale(50),
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: moderateScale(16),
    color: '#000',
  },
  verifyTextInline: {
    color: '#0a7cf3',
    fontWeight: '600',
    marginLeft: moderateScale(12),
  },
  errorText: {
    color: 'red',
    marginTop: moderateScale(8),
    fontSize: moderateScale(12),
  },
  otpButton: {
    marginTop: moderateScale(43),
    backgroundColor: '#0a7cf3',
    paddingVertical: moderateScale(14),
    borderRadius: moderateScale(30),
    alignItems: 'center',
  },
  otpButtonDisabled: {
    backgroundColor: '#a0cfff',
  },
  otpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: moderateScale(16),
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: moderateScale(61),
  },
  divider: {
    flex: 1,
    height: moderateScale(1),
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: moderateScale(10),
    color: 'black',
    fontSize: moderateScale(12),
  },
  googleButton: {
    backgroundColor: '#e8f0fe',
    paddingVertical: moderateScale(14),
    borderRadius: moderateScale(30),
    alignItems: 'center',
    marginBottom: moderateScale(46),
  },
  googleText: {
    fontWeight: '600',
    fontSize: moderateScale(16),
  },
  registerText: {
    textAlign: 'center',
    color: '#444',
    fontSize: moderateScale(14),
  },
  createAccount: {
    color: '#f77',
    fontWeight: '600',
    fontSize: moderateScale(14),
  },
});
